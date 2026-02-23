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
        <div className="relative w-full mx-auto mt-2">
            {/* Main Container with Waves */}
            <div className="relative flex flex-col items-center justify-center w-full">

                {/* Animated Wave Visualization - Centered properly and fading at edges */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                        width: '160%',
                        left: '-30%',
                        height: '140px',
                        top: '-20px',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                    }}
                >
                    {/* SVG Wave Container */}
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 1200 200"
                        preserveAspectRatio="none"
                        style={{ overflow: 'visible' }}
                    >
                        {/* Wave 1 - Blue */}
                        <motion.path
                            d="M0,100 Q150,50 300,100 T600,100 T900,100 T1200,100"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 1, opacity: 0.4 }}
                            animate={isListening ? {
                                opacity: [0.5, 0.9, 0.5],
                                d: [
                                    "M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100",
                                    "M0,100 Q150,160 300,100 T600,100 T900,100 T1200,100",
                                    "M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
                                ]
                            } : {
                                opacity: 0.4,
                                d: "M0,100 Q150,50 300,100 T600,100 T900,100 T1200,100"
                            }}
                            transition={isListening ? {
                                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                d: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            } : { duration: 0.5 }}
                        />

                        {/* Wave 2 - Cyan */}
                        <motion.path
                            d="M0,100 Q200,80 400,100 T800,100 T1200,100"
                            fill="none"
                            stroke="url(#gradient2)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 1, opacity: 0.4 }}
                            animate={isListening ? {
                                opacity: [0.6, 1, 0.6],
                                d: [
                                    "M0,100 Q200,70 400,100 T800,100 T1200,100",
                                    "M0,100 Q200,130 400,100 T800,100 T1200,100",
                                    "M0,100 Q200,70 400,100 T800,100 T1200,100"
                                ]
                            } : {
                                opacity: 0.4,
                                d: "M0,100 Q200,80 400,100 T800,100 T1200,100"
                            }}
                            transition={isListening ? {
                                opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
                                d: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
                            } : { duration: 0.5 }}
                        />

                        {/* Wave 3 - Green */}
                        <motion.path
                            d="M0,100 Q100,70 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100"
                            fill="none"
                            stroke="url(#gradient3)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 1, opacity: 0.3 }}
                            animate={isListening ? {
                                opacity: [0.4, 0.8, 0.4],
                                d: [
                                    "M0,100 Q100,60 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100",
                                    "M0,100 Q100,140 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100",
                                    "M0,100 Q100,60 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100"
                                ]
                            } : {
                                opacity: 0.3,
                                d: "M0,100 Q100,70 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100"
                            }}
                            transition={isListening ? {
                                opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                                d: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
                            } : { duration: 0.5 }}
                        />

                        {/* Wave 4 - Purple/Pink */}
                        <motion.path
                            d="M0,100 Q250,60 500,100 T1000,100 T1200,100"
                            fill="none"
                            stroke="url(#gradient4)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 1, opacity: 0.35 }}
                            animate={isListening ? {
                                opacity: [0.5, 0.85, 0.5],
                                d: [
                                    "M0,100 Q250,50 500,100 T1000,100 T1200,100",
                                    "M0,100 Q250,150 500,100 T1000,100 T1200,100",
                                    "M0,100 Q250,50 500,100 T1000,100 T1200,100"
                                ]
                            } : {
                                opacity: 0.35,
                                d: "M0,100 Q250,60 500,100 T1000,100 T1200,100"
                            }}
                            transition={isListening ? {
                                opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                                d: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
                            } : { duration: 0.5 }}
                        />

                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                                <stop offset="50%" stopColor="#0891b2" stopOpacity="1" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                            </linearGradient>
                            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* Microphone Button - Center Stage */}
                <motion.div
                    className="relative z-20 mb-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.button
                        onClick={startListening}
                        className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${isListening
                            ? 'w-32 h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-2xl'
                            : 'w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-xl hover:shadow-2xl'
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isListening ? {
                            boxShadow: [
                                '0 0 0 0 rgba(59, 130, 246, 0.7)',
                                '0 0 0 20px rgba(59, 130, 246, 0)',
                                '0 0 0 0 rgba(59, 130, 246, 0)'
                            ]
                        } : {}}
                        transition={isListening ? {
                            boxShadow: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeOut"
                            }
                        } : {}}
                    >
                        {/* Inner glow */}
                        <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />

                        {/* Mic Icon */}
                        <Mic className={`relative z-10 text-white ${isListening ? 'w-14 h-14' : 'w-10 h-10'} transition-all duration-300`} />

                        {/* Pulsing ring when not listening */}
                        {!isListening && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-white/30"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                    </motion.button>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className={`relative z-10 flex items-center w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 transition-all duration-300 ${isListening ? 'ring-4 ring-blue-200/50' : 'hover:shadow-3xl'
                        }`}
                    style={{
                        height: '56px',
                        borderRadius: '50px',
                    }}
                >
                    {/* Text Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Listening..." : "Ask AI: 'I need a halloween outfit'..."}
                        className="flex-grow h-full bg-transparent px-6 text-lg text-gray-800 placeholder-gray-400 focus:outline-none rounded-l-full"
                        disabled={isListening}
                    />

                    {/* Search Button */}
                    <button
                        onClick={() => handleSearch(query)}
                        className="h-full px-6 text-gray-400 hover:text-pink-500 transition-colors rounded-r-full group"
                    >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Helper Text */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-3 text-gray-500 text-sm font-medium flex items-center justify-center gap-2"
            >
                <Sparkles className="w-4 h-4 text-pink-500" />
                Try saying: "Show me red dresses for a wedding"
            </motion.p>
        </div>
    );
};

export default HeroSearch;
