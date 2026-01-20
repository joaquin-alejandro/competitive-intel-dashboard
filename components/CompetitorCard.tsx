import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CompetitorCardProps {
    name: string;
    url: string;
    logo: string;
    reason: string;
    similarity: number;
    selected: boolean;
    onToggle: () => void;
}

export function CompetitorCard({
    name,
    url,
    logo,
    reason,
    similarity,
    selected,
    onToggle,
}: CompetitorCardProps) {
    const getSimilarityColor = (score: number) => {
        if (score >= 85) return 'bg-green-100 text-green-700 border-green-200';
        if (score >= 70) return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${selected
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            onClick={onToggle}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center bg-white">
                        <Image
                            src={logo}
                            alt={`${name} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{name}</div>
                        <div className="text-xs text-gray-500">{new URL(url).hostname}</div>
                    </div>
                </div>
                {similarity > 0 && (
                    <Badge className={`text-xs font-medium border ${getSimilarityColor(similarity)}`}>
                        {similarity}%
                    </Badge>
                )}
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reason}</p>

            <div className="flex items-center justify-end">
                <Checkbox
                    checked={selected}
                    onCheckedChange={onToggle}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
