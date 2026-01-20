'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingTable } from '@/components/PricingTable';
import {
    ArrowLeft,
    ExternalLink,
    TrendingUp,
    Shield,
    Target,
    Activity,
    Globe,
    Zap,
    Gauge
} from 'lucide-react';
import { CompetitorAnalysis } from '@/lib/types';
import Image from 'next/image';
import { PerformanceCard } from '@/components/PerformanceCard';

export default function CompetitorDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('competitorAnalysis');
        if (!stored) {
            router.push('/dashboard');
            return;
        }

        const analyses: CompetitorAnalysis[] = JSON.parse(stored);
        const decodedId = decodeURIComponent(params.id as string);

        const found = analyses.find(a =>
            a.url === decodedId ||
            new URL(a.url).hostname === decodedId ||
            a.competitor.toLowerCase().replace(/\s+/g, '-') === decodedId
        );

        if (found) {
            setAnalysis(found);
        } else {
            router.push('/dashboard');
        }
        setLoading(false);
    }, [params.id, router]);

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
                                alt={analysis.competitor}
                                width={32}
                                height={32}
                                unoptimized
                                className="rounded shadow-sm"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{analysis.competitor}</h1>
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
                    <Badge variant="outline" className="bg-white font-medium px-3 py-1 border-gray-200">
                        Detailed Analysis
                    </Badge>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
                {/* Executive Summary */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <Activity className="h-4 w-4" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Executive Summary</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    "{analysis.messaging.headline}"
                                </h3>
                                <p className="text-lg text-gray-600 font-medium">
                                    {analysis.messaging.valueProposition}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.insights.strengths.map((strength, i) => (
                                    <Badge key={i} className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 px-3 py-1">
                                        <Shield className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                        {strength}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <Target className="h-3.5 w-3.5" />
                                Target Audience
                            </h4>
                            <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                                {analysis.messaging.targetAudience}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
                    {/* Positioning & Strategy */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <TrendingUp className="h-4 w-4" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Market Positioning</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">Core Positioning</h4>
                                <p className="text-sm text-gray-600 leading-relaxed italic">{analysis.insights.positioning}</p>
                            </div>
                            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">Strategic Direction</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{analysis.insights.strategy}</p>
                            </div>
                        </div>
                    </section>

                    {/* Differentiators */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Zap className="h-4 w-4" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Key Differentiators</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {analysis.messaging.differentiators.map((diff, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-blue-50 bg-blue-50/20">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-700 text-xs font-bold">{i + 1}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{diff}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Products & Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-gray-100">
                    {/* Products */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Globe className="h-4 w-4" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Portfolio</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {analysis.products.map((product, i) => (
                                <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg text-center hover:border-black transition-colors cursor-default">
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

                {/* Pricing Table Section */}
                <section className="pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <Activity className="h-4 w-4" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Pricing Structures</h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-2 md:p-8 shadow-sm">
                        <PricingTable competitors={[analysis]} />
                    </div>
                </section>
            </main>
        </div>
    );
}
