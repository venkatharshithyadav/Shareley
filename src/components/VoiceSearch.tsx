import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

interface VoiceSearchProps {
    onSearch: (query: string) => void;
    isListening?: boolean;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const startListening = () => {
        if (!isSupported) {
            alert('Voice search is not supported in this browser.');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onSearch(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!isSupported) return null;

    return (
        <button
            onClick={startListening}
            className={`p-3 rounded-full transition-all duration-200 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg ring-4 ring-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-500'
                }`}
            title="Voice Search"
        >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
    );
};

export default VoiceSearch;
