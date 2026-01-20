import { Badge } from '@/components/ui/badge';
import { PageSpeedData } from '@/lib/types';
import { Gauge, Zap, Accessibility, ShieldCheck, Search } from 'lucide-react';

interface PerformanceCardProps {
    data: PageSpeedData;
    title?: string;
}

export function PerformanceCard({ data, title }: PerformanceCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50 border-green-100';
        if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    const getBarColor = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 50) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {title && (
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        {title}
                    </h3>
                </div>
            )}
            <div className="p-6 space-y-6">
                {/* Score Grid */}
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                        <div className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${getScoreColor(data.performance)}`}>
                            <Zap className="h-4 w-4 mb-1 opacity-70" />
                            <span className="text-lg font-bold">{data.performance}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Perf</span>
                    </div>
                    <div className="space-y-2">
                        <div className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${getScoreColor(data.accessibility)}`}>
                            <Accessibility className="h-4 w-4 mb-1 opacity-70" />
                            <span className="text-lg font-bold">{data.accessibility}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Access</span>
                    </div>
                    <div className="space-y-2">
                        <div className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${getScoreColor(data.bestPractices)}`}>
                            <ShieldCheck className="h-4 w-4 mb-1 opacity-70" />
                            <span className="text-lg font-bold">{data.bestPractices}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Practices</span>
                    </div>
                    <div className="space-y-2">
                        <div className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${getScoreColor(data.seo)}`}>
                            <Search className="h-4 w-4 mb-1 opacity-70" />
                            <span className="text-lg font-bold">{data.seo}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">SEO</span>
                    </div>
                </div>

                {/* Core Web Vitals */}
                <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Largest Contentful Paint</span>
                        <span className="font-bold text-gray-900">{data.metrics.lcp}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Cumulative Layout Shift</span>
                        <span className="font-bold text-gray-900">{data.metrics.cls}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Total Blocking Time</span>
                        <span className="font-bold text-gray-900">{data.metrics.tbt}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Speed Index</span>
                        <span className="font-bold text-gray-900">{data.metrics.speedIndex}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
