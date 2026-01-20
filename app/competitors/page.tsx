'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompetitorCard } from '@/components/CompetitorCard';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';
import { Competitor } from '@/lib/types';

export default function CompetitorsPage() {
    const router = useRouter();
    const [siteInfo, setSiteInfo] = useState<any>(null);
    const [suggestedCompetitors, setSuggestedCompetitors] = useState<Competitor[]>([]);
    const [manualCompetitors, setManualCompetitors] = useState<Competitor[]>([]);
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [manualUrl, setManualUrl] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);

    useEffect(() => {
        // Load site analysis from localStorage
        const stored = localStorage.getItem('siteAnalysis');
        if (!stored) {
            router.push('/');
            return;
        }

        const data = JSON.parse(stored);

        // If we already have the data, don't re-trigger things if component re-mounts
        // just by checking if the data is different or if suggestedCompetitors is empty
        setSiteInfo(data);

        // Fetch competitor suggestions only if we haven't yet or if it's a new site
        if (suggestedCompetitors.length === 0) {
            fetchCompetitors(data);
        } else {
            setLoading(false);
        }
    }, [suggestedCompetitors.length]);

    const fetchCompetitors = async (siteData: any) => {
        try {
            const response = await fetch('/api/suggest-competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userSite: siteData.url,
                    industry: siteData.industry,
                    businessModel: siteData.businessModel,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setSuggestedCompetitors(result.data);
                // Auto-select all suggested competitors
                setSelectedUrls(new Set(result.data.map((c: Competitor) => c.url)));
            }
        } catch (error) {
            console.error('Error fetching competitors:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCompetitor = (url: string) => {
        const newSelected = new Set(selectedUrls);
        if (newSelected.has(url)) {
            newSelected.delete(url);
        } else {
            newSelected.add(url);
        }
        setSelectedUrls(newSelected);
    };

    const addManualCompetitor = () => {
        if (!manualUrl) return;

        const newCompetitor: Competitor = {
            name: new URL(manualUrl).hostname,
            url: manualUrl,
            logo: `https://www.google.com/s2/favicons?domain=${new URL(manualUrl).hostname}&sz=64`,
            reason: 'Manually added competitor',
            similarity: 0,
        };

        setManualCompetitors([...manualCompetitors, newCompetitor]);
        setSelectedUrls(new Set([...selectedUrls, manualUrl]));
        setManualUrl('');
        setShowManualInput(false);
    };

    const handleAnalyze = async () => {
        if (selectedUrls.size === 0) return;

        setAnalyzing(true);

        try {
            const response = await fetch('/api/analyze-competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitors: Array.from(selectedUrls),
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Store analysis results
                localStorage.setItem('competitorAnalysis', JSON.stringify(result.data));
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error analyzing competitors:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const allCompetitors = [...suggestedCompetitors, ...manualCompetitors];

    if (!siteInfo) return null;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="mb-4 h-8 px-3 text-sm text-gray-600 hover:text-black"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-semibold mb-2">Select Competitors</h1>
                    <p className="text-sm text-gray-600">
                        Analyzing: <span className="font-medium text-black">{siteInfo.url}</span> • {siteInfo.industry}
                    </p>
                </div>

                {analyzing ? (
                    <div className="py-12">
                        <AnalysisProgress />
                    </div>
                ) : loading ? (
                    <div className="text-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600">Finding your competitors...</p>
                    </div>
                ) : (
                    <>
                        {/* Suggested Competitors */}
                        <div className="mb-8">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">AI-Suggested Competitors</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {suggestedCompetitors.map((competitor) => (
                                    <CompetitorCard
                                        key={competitor.url}
                                        {...competitor}
                                        selected={selectedUrls.has(competitor.url)}
                                        onToggle={() => toggleCompetitor(competitor.url)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Manual Add Section */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium">Add Manual Competitor</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowManualInput(!showManualInput)}
                                    className="h-7 px-3 text-xs border-gray-300"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Add
                                </Button>
                            </div>
                            {showManualInput && (
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://competitor.com"
                                        value={manualUrl}
                                        onChange={(e) => setManualUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addManualCompetitor()}
                                        className="flex-1 h-9 text-sm border-gray-300"
                                    />
                                    <Button
                                        onClick={addManualCompetitor}
                                        className="h-9 px-4 bg-black hover:bg-gray-800 text-white text-sm"
                                    >
                                        Add
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Manual Competitors List */}
                        {manualCompetitors.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-sm font-medium text-gray-700 mb-4">Manually Added</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {manualCompetitors.map((competitor) => (
                                        <CompetitorCard
                                            key={competitor.url}
                                            {...competitor}
                                            selected={selectedUrls.has(competitor.url)}
                                            onToggle={() => toggleCompetitor(competitor.url)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                            <div className="max-w-6xl mx-auto flex items-center justify-between">
                                <div className="text-sm font-medium">
                                    {selectedUrls.size} competitor{selectedUrls.size !== 1 ? 's' : ''} selected
                                </div>
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={selectedUrls.size === 0 || analyzing}
                                    className="h-9 px-6 bg-black hover:bg-gray-800 text-white"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze Competitors →'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
