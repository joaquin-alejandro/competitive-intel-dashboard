"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lightbulb } from 'lucide-react';

const ANALYSIS_STEPS = [
    "Identifying key competitors...",
    "Visiting competitor websites...",
    "Extracting pricing models...",
    "Analyzing product features...",
    "Running performance benchmarks...",
    "Calculating market positioning...",
    "Synthesizing strategic insights...",
    "Finalizing competitive report..."
];

const DID_YOU_KNOW = [
    "Tracking competitor pricing changes can help you spot new market strategies early.",
    "Page load speed is a ranking factor for Google SEO.",
    "Analyzing competitor reviews can reveal their biggest product weaknesses.",
    "Most B2B buyers look at 3-5 competitors before making a purchase decision.",
    "Consistent messaging across channels builds stronger brand authority.",
    "Gap analysis helps identify features your competitors are missing.",
];

export function AnalysisProgress() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentTip, setCurrentTip] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate progress over 30 seconds (average analysis time)
        const duration = 40000; // 40s slightly longer than expected average
        const interval = 100;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return 95; // Hold at 95% until complete
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Rotate steps every 4 seconds
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
        }, 4000);

        // Rotate tips every 8 seconds
        const tipInterval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % DID_YOU_KNOW.length);
        }, 8000);

        return () => {
            clearInterval(stepInterval);
            clearInterval(tipInterval);
        };
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-8 text-center">
            <div className="space-y-4">
                <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>Analysis in progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 text-lg font-semibold text-foreground/80"
                    >
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        {ANALYSIS_STEPS[currentStep]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="bg-secondary/30 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Did you know?</span>
                </div>
                <div className="h-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentTip}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-muted-foreground leading-relaxed"
                        >
                            "{DID_YOU_KNOW[currentTip]}"
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
