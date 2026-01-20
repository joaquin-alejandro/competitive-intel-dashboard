"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Globe, ChevronDown, MoveRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WebsiteInputProps {
    onSubmit: (url: string) => void;
    isLoading?: boolean;
    className?: string;
}

export function WebsiteInput({ onSubmit, isLoading, className }: WebsiteInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestion, setSuggestion] = useState<{ domain: string, url: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Simple heuristic to extract domain and suggest a valid URL
        if (inputValue.length > 3) {
            let domain = inputValue.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
            domain = domain.split('/')[0];

            if (domain.includes('.')) {
                setSuggestion({
                    domain: domain,
                    url: `https://${domain}`
                });
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [inputValue]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue) return;

        // Use suggestion if available and user just hit enter on a partial match, 
        // or validate the input value
        const urlToSubmit = suggestion && inputValue.includes(suggestion.domain.split('.')[0])
            ? suggestion.url
            : inputValue.startsWith('http') ? inputValue : `https://${inputValue}`;

        onSubmit(urlToSubmit);
    };

    const handleSuggestionClick = () => {
        if (suggestion) {
            setInputValue(suggestion.url);
            onSubmit(suggestion.url);
        }
    };

    return (
        <div className={cn("relative w-full max-w-2xl mx-auto font-sans", className)}>
            <form
                onSubmit={handleSubmit}
                className={cn(
                    "relative flex items-center bg-[#0a0f1d] border border-blue-900/30 rounded-full p-1.5 shadow-2xl transition-all duration-300",
                    isFocused ? "ring-2 ring-blue-500/20 border-blue-500/50" : "hover:border-blue-500/30"
                )}
            >
                {/* Left 'Label' */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#161b2c] rounded-full text-gray-300 text-sm font-medium mr-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Website</span>
                    <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                </div>

                {/* Search Icon */}
                <Search className="w-5 h-5 text-gray-400 ml-3 sm:ml-0" />

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="e.g. stripe.com"
                    className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 px-3 py-2 text-base md:text-lg w-full"
                    disabled={isLoading}
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!inputValue || isLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span className="hidden sm:inline">Get Insights</span>
                            <MoveRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Dropdown Suggestion */}
            <AnimatePresence>
                {isFocused && suggestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-[#0a0f1d]/95 backdrop-blur-xl border border-blue-900/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Suggested Website
                        </div>
                        <button
                            onClick={handleSuggestionClick}
                            className="w-full flex items-center gap-4 p-3 hover:bg-blue-500/10 rounded-xl transition-colors group text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 shadow-lg group-hover:scale-105 transition-transform">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${suggestion.domain}&sz=64`}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback to Globe icon if image fails
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium text-lg flex items-center gap-2">
                                    {suggestion.domain}
                                    <Globe className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-gray-400 text-sm truncate">
                                    {suggestion.url}
                                </div>
                            </div>
                            <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoveRight className="w-5 h-5" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 pointer-events-none" />
        </div>
    );
}
