import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, X, Send, User, ChevronLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ChatWidget: React.FC = () => {
    const { user } = useAuth();
    const {
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        loading,
        isChatOpen,
        setIsChatOpen
    } = useChat();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isChatOpen, activeConversationId]);

    // Auto-open on active conversation
    useEffect(() => {
        if (activeConversationId) {
            setIsChatOpen(true);
        }
    }, [activeConversationId, setIsChatOpen]);

    // Handle sending message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        await sendMessage(activeConversationId, newMessage);
        setNewMessage('');
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isChatOpen && (
                <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden pointer-events-auto transition-all animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center space-x-2">
                            {activeConversationId ? (
                                <button
                                    onClick={() => setActiveConversationId(null)}
                                    className="hover:bg-indigo-700 p-1 rounded-full transition-colors mr-1"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            ) : (
                                <MessageSquare className="w-5 h-5" />
                            )}
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg leading-tight">
                                    {activeConversationId
                                        ? conversations.find(c => c.id === activeConversationId)?.otherParticipant.name || 'Chat'
                                        : 'Messages'}
                                </span>
                                {activeConversationId && (
                                    <span className="text-xs text-indigo-200">
                                        Active now
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="hover:bg-indigo-700 p-1 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        {!activeConversationId ? (
                            // Conversations List
                            <div className="divide-y divide-gray-100">
                                {conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                                        <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                                        <p>No conversations yet.</p>
                                        <p className="text-sm mt-2">Browse listings and chat with sellers!</p>
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <button
                                            key={conv.id}
                                            onClick={() => setActiveConversationId(conv.id)}
                                            className="w-full p-4 flex items-center space-x-4 hover:bg-white transition-colors text-left bg-white/50 backdrop-blur-sm"
                                        >
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                                {conv.otherParticipant.avatar ? (
                                                    <img src={conv.otherParticipant.avatar} alt={conv.otherParticipant.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                        {conv.otherParticipant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {conv.otherParticipant.name}
                                                </h4>
                                                <p className={`text-sm truncate ${conv.lastMessage ? 'text-gray-600' : 'text-indigo-500'}`}>
                                                    {conv.lastMessage ? conv.lastMessage.content : 'Click to view messages'}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Messages View
                            <div className="flex flex-col h-full">
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-gray-400 py-8">
                                            Say hello! 👋
                                        </div>
                                    ) : (
                                        messages.map(msg => {
                                            const isMe = msg.senderId === user.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${isMe
                                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 pointer-events-auto relative group"
            >
                {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

                {/* Notification Badge could go here */}
                {/* <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span> */}
            </button>
        </div>
    );
};

export default ChatWidget;
