"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input'; // Use standard input
import { Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MinimalistWebsiteInputProps {
    onSubmit: (url: string) => void;
    isLoading?: boolean;
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    autoFocus?: boolean;
}

export function MinimalistWebsiteInput({
    onSubmit,
    isLoading,
    className,
    placeholder = "https://yourwebsite.com",
    value: controlledValue,
    onChange: controlledOnChange,
    autoFocus
}: MinimalistWebsiteInputProps) {
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestion, setSuggestion] = useState<{ domain: string, url: string } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

    useEffect(() => {
        const val = inputValue;
        if (val.length > 2) {
            let domain = val.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
            domain = domain.split('/')[0];

            // Simple heuristic: if it looks like a word without extension, suggest .com
            if (!domain.includes('.')) {
                setSuggestion({
                    domain: `${domain}.com`,
                    url: `https://${domain}.com`
                });
            } else if (domain.includes('.')) {
                setSuggestion({
                    domain: domain,
                    url: val.startsWith('http') ? val : `https://${domain}`
                });
            } else {
                setSuggestion(null);
            }
        } else {
            setSuggestion(null);
        }
    }, [inputValue]);

    // Handle outside click to close suggestion
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (controlledOnChange) controlledOnChange(val);
        else setInternalValue(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (suggestion && isFocused) {
                e.preventDefault();
                // If they hit enter and there is a suggestion, assume they might want that if they haven't typed a full URL
                // But usually enter submits the form. 
                // Let's defer to the form submit unless they explicitly selected the dropdown (which is handled by click).
                // Actually, a nice UX is: if text is "stripe" and suggestion is "stripe.com", enter should submit "stripe.com"
                onSubmit(suggestion.url);
            } else {
                onSubmit(inputValue);
            }
        }
    };

    const selectSuggestion = () => {
        if (suggestion) {
            if (controlledOnChange) controlledOnChange(suggestion.url);
            else setInternalValue(suggestion.url);
            onSubmit(suggestion.url);
            setIsFocused(false);
        }
    };

    return (
        <div className={cn("relative w-full", className)} ref={wrapperRef}>
            <div className="relative">
                <Input
                    type="url"
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                )}
            </div>

            {/* Minimalist Dropdown */}
            {isFocused && suggestion && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                    <button
                        onClick={selectSuggestion}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <Image
                                src={`https://www.google.com/s2/favicons?domain=${suggestion.domain}&sz=64`}
                                alt="Logo"
                                width={16}
                                height={16}
                                className="rounded-sm"
                                unoptimized
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
                                }}
                            />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{suggestion.domain}</div>
                            <div className="text-xs text-blue-600">Click to analyze {suggestion.domain}</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
