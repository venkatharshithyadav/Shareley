import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSearchIntent } from '../utils/aiSearch';
import { useListings } from '../context/ListingsContext';

const HeroSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const navigate = useNavigate();
    const { listings } = useListings();
    const inputRef = useRef<HTMLInputElement>(null);

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
            setQuery(transcript);
            setIsListening(false);
            handleSearch(transcript);
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

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        // Navigate to marketplace with search params
        navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}&ai=true`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto mt-8">
            <div className="relative flex items-center justify-center">
                {/* Wave Animation Background */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full border-2 border-pink-400"
                                    initial={{ width: '100%', height: '100%', opacity: 0.8 }}
                                    animate={{
                                        width: ['100%', '150%'],
                                        height: ['100%', '250%'],
                                        opacity: [0.8, 0],
                                        borderRadius: ['50%', '40%', '60%', '50%'] // Wavy shape
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "easeOut"
                                    }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Search Bar Container */}
                <motion.div
                    className={`relative z-10 flex items-center w-full bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 transition-all duration-300 ${isListening ? 'ring-4 ring-pink-200 scale-105' : 'hover:shadow-3xl'
                        }`}
                    style={{
                        height: '80px',
                        borderRadius: '50px', // Pill shape
                    }}
                >
                    {/* Text Input (Left) */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Listening..." : "Ask AI: 'I need a halloween outfit'..."}
                        className="flex-grow h-full bg-transparent px-8 text-xl text-gray-800 placeholder-gray-400 focus:outline-none rounded-l-full"
                        disabled={isListening}
                    />

                    {/* Central/Right Big Mic Button */}
                    <div className="relative flex items-center justify-center pr-2">
                        <motion.button
                            onClick={startListening}
                            className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${isListening
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-110'
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isListening ? (
                                <Mic className="w-8 h-8 animate-pulse" />
                            ) : (
                                <Mic className="w-8 h-8" />
                            )}

                            {/* Glow effect */}
                            {!isListening && (
                                <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
                            )}
                        </motion.button>
                    </div>

                    {/* Search Icon (Far Right) */}
                    <button
                        onClick={() => handleSearch(query)}
                        className="h-full px-6 text-gray-400 hover:text-pink-500 transition-colors rounded-r-full"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </motion.div>
            </div>

            {/* Helper Text */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-4 text-gray-500 text-sm font-medium flex items-center justify-center gap-2"
            >
                <Sparkles className="w-4 h-4 text-pink-500" />
                Try saying: "Show me red dresses for a wedding"
            </motion.p>
        </div>
    );
};

export default HeroSearch;
