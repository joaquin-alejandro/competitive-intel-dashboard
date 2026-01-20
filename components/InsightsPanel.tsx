import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, TrendingUp } from 'lucide-react';

interface InsightsPanelProps {
    insights: {
        summary: string;
        opportunities: string[];
        recommendations: string[];
    };
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
    return (
        <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-gray-700" />
                    <h3 className="font-semibold text-sm">Executive Summary</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{insights.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-4 h-4 text-gray-700" />
                        <h3 className="font-semibold text-sm">Opportunities</h3>
                    </div>
                    <ul className="space-y-2.5">
                        {insights.opportunities.map((opportunity, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span className="text-gray-700">{opportunity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-gray-700" />
                        <h3 className="font-semibold text-sm">Recommendations</h3>
                    </div>
                    <ol className="space-y-2.5">
                        {insights.recommendations.map((recommendation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="font-semibold text-gray-700 min-w-[1.25rem]">{idx + 1}.</span>
                                <span className="text-gray-700">{recommendation}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}
