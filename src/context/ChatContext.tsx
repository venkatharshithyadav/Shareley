import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { ChatContextType, Conversation, Message } from '../types';
import toast from 'react-hot-toast';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch conversations
    useEffect(() => {
        if (!user) {
            setConversations([]);
            return;
        }

        const fetchConversations = async () => {
            try {
                const { data, error } = await supabase
                    .from('conversations')
                    .select('*')
                    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
                    .order('updated_at', { ascending: false });

                if (error) throw error;

                const formattedConversations: Conversation[] = data.map((conv: any) => {
                    const isParticipant1 = conv.participant1_id === user.id;
                    const otherId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
                    const otherName = isParticipant1 ? conv.participant2_name : conv.participant1_name;

                    return {
                        id: conv.id,
                        otherParticipant: {
                            id: otherId,
                            name: otherName || 'User',
                            avatar: undefined
                        },
                        updatedAt: conv.updated_at
                    };
                });

                setConversations(formattedConversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();

        // Subscribe to new conversations
        const subscription = supabase
            .channel('public:conversations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, (payload) => {
                if (payload.new.participant1_id === user.id || payload.new.participant2_id === user.id) {
                    fetchConversations();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };

    }, [user]);

    // Fetch messages for active conversation
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', activeConversationId)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                const formattedMessages: Message[] = data.map((msg: any) => ({
                    id: msg.id,
                    conversationId: msg.conversation_id,
                    senderId: msg.sender_id,
                    content: msg.content,
                    read: msg.read,
                    createdAt: msg.created_at
                }));
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error('Failed to load messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Subscribe to new messages in this conversation
        const subscription = supabase
            .channel(`chat:${activeConversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversationId}`
            }, (payload) => {
                const newMsg = payload.new;
                setMessages(prev => [...prev, {
                    id: newMsg.id,
                    conversationId: newMsg.conversation_id,
                    senderId: newMsg.sender_id,
                    content: newMsg.content,
                    read: newMsg.read,
                    createdAt: newMsg.created_at
                }]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [activeConversationId]);


    const sendMessage = async (conversationId: string, content: string) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content
                });

            if (error) throw error;

            // Update conversation updated_at
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId);

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
            throw error;
        }
    };

    const startConversation = async (otherUserId: string, otherUserName: string): Promise<string> => {
        if (!user) throw new Error('Not authenticated');

        // Check if conversation already exists
        const { data: existingConvs, error: fetchError } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`);

        if (fetchError) {
            console.error(fetchError);
            throw fetchError;
        }

        if (existingConvs && existingConvs.length > 0) {
            return existingConvs[0].id;
        }

        // Create new conversation with names
        const myName = user.name || 'User';

        const { data, error } = await supabase
            .from('conversations')
            .insert({
                participant1_id: user.id,
                participant2_id: otherUserId,
                participant1_name: myName,
                participant2_name: otherUserName
            })
            .select()
            .single();

        if (error) throw error;

        return data.id;
    };

    const markAsRead = async (conversationId: string) => {
        if (!user) return;
        await supabase
            .from('messages')
            .update({ read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id);
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversationId,
            setActiveConversationId,
            messages,
            loading,
            sendMessage,
            startConversation,
            markAsRead
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
