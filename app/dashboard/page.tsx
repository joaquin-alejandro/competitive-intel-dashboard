'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingTable } from '@/components/PricingTable';
import { InsightsPanel } from '@/components/InsightsPanel';
import {
    ArrowLeft,
    Download,
    RefreshCw,
    BarChart3,
    DollarSign,
    Package,
    MessageSquare,
    Lightbulb,
    Home,
    Search,
    Settings,
    HelpCircle,
    Plus,
    X,
    Loader2
} from 'lucide-react';
import { CompetitorAnalysis, ApiResponse, SiteAnalysis } from '@/lib/types';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { PerformanceCard } from '@/components/PerformanceCard';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardPage() {
    const router = useRouter();
    const [analyses, setAnalyses] = useState<CompetitorAnalysis[]>([]);
    const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('competitorAnalysis');
        const storedSite = localStorage.getItem('siteAnalysis');

        if (!stored) {
            router.push('/');
            return;
        }

        setAnalyses(JSON.parse(stored));
        if (storedSite) {
            setSiteAnalysis(JSON.parse(storedSite));
        }
    }, [router]);

    const handleAddCompetitor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompetitorUrl) return;

        setIsAdding(true);
        try {
            const response = await fetch('/api/analyze-competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitors: [newCompetitorUrl],
                }),
            });

            const result: ApiResponse<CompetitorAnalysis[]> = await response.json();
            if (result.success && result.data) {
                const newAnalysis = result.data[0];
                const updatedAnalyses = [...analyses, newAnalysis];
                setAnalyses(updatedAnalyses);
                localStorage.setItem('competitorAnalysis', JSON.stringify(updatedAnalyses));
                setIsAddModalOpen(false);
                setNewCompetitorUrl('');
                toast.success(`Analysis for ${newAnalysis.competitor} completed!`);
            } else {
                toast.error(result.error || 'Failed to analyze competitor');
            }
        } catch (error) {
            console.error('Error adding competitor:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    if (analyses.length === 0) return null;

    // Calculate stats
    const totalCompetitors = analyses.length;
    const totalPlans = analyses.reduce((sum, a) => sum + a.pricing.plans.length, 0);
    const totalProducts = analyses.reduce((sum, a) => sum + a.products.length, 0);

    // Prepare insights data
    const allOpportunities = analyses.flatMap((a) => [
        `${a.competitor} focuses on: ${a.insights.positioning}`,
        ...a.messaging.differentiators.map((d) => `${a.competitor} differentiates with: ${d}`),
    ]);

    const allRecommendations = [
        'Consider pricing strategies that balance value and accessibility',
        'Highlight unique features that competitors lack',
        'Target underserved market segments',
        'Invest in areas where competitors show weaknesses',
        'Leverage strengths in messaging and positioning',
    ];

    const insightsData = {
        summary: `Analysis of ${totalCompetitors} competitors reveals diverse positioning strategies and pricing models. Key insights show opportunities in feature differentiation, pricing optimization, and targeted messaging to specific market segments.`,
        opportunities: allOpportunities.slice(0, 6),
        recommendations: allRecommendations,
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <div className="w-16 border-r border-gray-200 flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                        <Home className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/competitors')}
                                className="h-8 px-3 text-sm text-gray-600 hover:text-black"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <h1 className="text-lg font-semibold">Competitive Intelligence</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled
                                className="h-8 px-3 text-sm border-gray-300"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="h-8 px-3 text-sm bg-black hover:bg-gray-800 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Competitor
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="h-10 bg-gray-100 p-1">
                                <TabsTrigger value="overview" className="text-sm">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="pricing" className="text-sm">
                                    Pricing
                                </TabsTrigger>
                                <TabsTrigger value="products" className="text-sm">
                                    Products
                                </TabsTrigger>
                                <TabsTrigger value="messaging" className="text-sm">
                                    Messaging
                                </TabsTrigger>
                                <TabsTrigger value="insights" className="text-sm">
                                    Insights
                                </TabsTrigger>
                                <TabsTrigger value="performance" className="text-sm">
                                    Performance
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            Competitors Analyzed
                                        </div>
                                        <div className="text-2xl font-semibold">{totalCompetitors}</div>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            Pricing Plans
                                        </div>
                                        <div className="text-2xl font-semibold">{totalPlans}</div>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            Products Cataloged
                                        </div>
                                        <div className="text-2xl font-semibold">{totalProducts}</div>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            Last Updated
                                        </div>
                                        <div className="text-sm font-medium">Just now</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {analyses.map((analysis) => (
                                        <div key={analysis.url} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Image
                                                    src={`https://www.google.com/s2/favicons?domain=${new URL(analysis.url).hostname}&sz=64`}
                                                    alt={analysis.competitor}
                                                    width={32}
                                                    height={32}
                                                    unoptimized
                                                    className="rounded"
                                                />
                                                <div>
                                                    <div className="font-semibold">{analysis.competitor}</div>
                                                    <div className="text-xs text-gray-500">{new URL(analysis.url).hostname}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 mb-1">Primary Focus</div>
                                                    <div className="text-sm">{analysis.insights.positioning}</div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {analysis.insights.strengths.slice(0, 2).map((strength, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                                                {strength}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/competitors/${encodeURIComponent(analysis.url)}`)}
                                                        className="text-xs h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Pricing Tab */}
                            <TabsContent value="pricing" className="space-y-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4">Pricing Comparison</h2>
                                    <PricingTable competitors={analyses} />
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4">Pricing Strategy Analysis</h2>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span>Price ranges vary significantly across competitors, indicating different target markets</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span>Most competitors offer tiered pricing with 3-4 plans</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            <span>Feature differentiation is key to justifying premium tiers</span>
                                        </li>
                                    </ul>
                                </div>
                            </TabsContent>

                            {/* Products Tab */}
                            <TabsContent value="products" className="space-y-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4">Product Comparison</h2>
                                    <div className="space-y-4">
                                        {analyses.map((analysis) => (
                                            <div key={analysis.url} className="border-b border-gray-100 pb-4 last:border-0">
                                                <div className="font-medium mb-2 text-sm">{analysis.competitor}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.products.map((product, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs font-normal">
                                                            {product}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4">Product Count by Competitor</h2>
                                    <div className="space-y-3">
                                        {analyses.map((analysis) => (
                                            <div key={analysis.url}>
                                                <div className="flex items-center justify-between mb-1.5 text-sm">
                                                    <span className="font-medium">{analysis.competitor}</span>
                                                    <span className="text-gray-500">{analysis.products.length} products</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className="bg-black h-1.5 rounded-full"
                                                        style={{ width: `${(analysis.products.length / Math.max(...analyses.map(a => a.products.length))) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Messaging Tab */}
                            <TabsContent value="messaging" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {analyses.map((analysis) => (
                                        <div key={analysis.url} className="border border-gray-200 rounded-lg p-6">
                                            <div className="font-semibold mb-4">{analysis.competitor}</div>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 mb-1">Main Headline</div>
                                                    <div className="text-sm font-medium">{analysis.messaging.headline}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 mb-1">Value Proposition</div>
                                                    <div className="text-sm bg-gray-50 border-l-2 border-gray-300 p-3 italic">
                                                        {analysis.messaging.valueProposition}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 mb-1">Target Audience</div>
                                                    <div className="text-sm">{analysis.messaging.targetAudience}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-gray-500 mb-2">Key Differentiators</div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {analysis.messaging.differentiators.map((diff, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                                                {diff}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Insights Tab */}
                            <TabsContent value="insights">
                                <InsightsPanel insights={insightsData} />
                            </TabsContent>

                            {/* Performance Tab */}
                            <TabsContent value="performance" className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Owner Site Performance */}
                                    {siteAnalysis?.pageSpeed && (
                                        <div className="space-y-4">
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                Your Website Performance
                                            </h2>
                                            <PerformanceCard data={siteAnalysis.pageSpeed} title={new URL(siteAnalysis.url || '').hostname} />
                                        </div>
                                    )}

                                    {/* Top Competitor Performance */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                            Competitor Performance
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {analyses.filter(a => a.pageSpeed).map((analysis) => (
                                                <PerformanceCard
                                                    key={analysis.url}
                                                    data={analysis.pageSpeed!}
                                                    title={analysis.competitor}
                                                />
                                            ))}
                                            {analyses.every(a => !a.pageSpeed) && (
                                                <div className="p-12 text-center border border-dashed border-gray-200 rounded-xl">
                                                    <p className="text-sm text-gray-500">No performance data available for competitors.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Add Competitor Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Add New Competitor</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCompetitor} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Website URL</label>
                                <Input
                                    type="url"
                                    required
                                    placeholder="https://competitor.com"
                                    value={newCompetitorUrl}
                                    onChange={(e) => setNewCompetitorUrl(e.target.value)}
                                    className="border-gray-200 focus:ring-black"
                                    autoFocus
                                />
                                <p className="text-[10px] text-gray-400">
                                    Our AI will analyze the competitor's pricing, messaging, and products.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isAdding}
                                    className="bg-black hover:bg-gray-800 text-white min-w-[100px]"
                                >
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Start Analysis'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster position="bottom-right" />
        </div>
    );
}
