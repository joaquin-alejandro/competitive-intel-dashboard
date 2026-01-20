'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ExternalLink,
    TrendingUp,
    Shield,
    Target,
    Activity,
    Globe,
    Zap,
    Briefcase
} from 'lucide-react';
import { SiteAnalysis } from '@/lib/types';
import Image from 'next/image';
import { PerformanceCard } from '@/components/PerformanceCard';

export default function MySitePage() {
    const router = useRouter();
    const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('siteAnalysis');
        if (!stored) {
            router.push('/');
            return;
        }

        setAnalysis(JSON.parse(stored));
        setLoading(false);
    }, [router]);

    if (loading) return null;
    if (!analysis) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/dashboard')}
                            className="h-8 px-2 hover:bg-gray-200/50 text-gray-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Image
                                src={`https://www.google.com/s2/favicons?domain=${new URL(analysis.url).hostname}&sz=64`}
                                alt="Your Site"
                                width={32}
                                height={32}
                                unoptimized
                                className="rounded shadow-sm"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">My Website Analysis</h1>
                                <a
                                    href={analysis.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    {new URL(analysis.url).hostname}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium px-3 py-1 border-blue-100">
                        Primary Target
                    </Badge>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
                {/* Core Identity */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <Activity className="h-4 w-4" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Core Identity</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Industry Niche
                            </h4>
                            <p className="text-lg font-bold text-gray-900 leading-tight">
                                {analysis.industry}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5" />
                                Business Model
                            </h4>
                            <p className="text-lg font-bold text-gray-900 leading-tight">
                                {analysis.businessModel}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <Target className="h-3.5 w-3.5" />
                                Target Market
                            </h4>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed">
                                {analysis.targetMarket}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-gray-100">
                    {/* Products */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Globe className="h-4 w-4" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Identified Products</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {analysis.products.map((product, i) => (
                                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-black" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{product}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance */}
                    {analysis.pageSpeed && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Activity className="h-4 w-4" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Technical Performance</h2>
                            </div>
                            <PerformanceCard data={analysis.pageSpeed} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
