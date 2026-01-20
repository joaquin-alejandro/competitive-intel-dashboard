import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CompetitorAnalysis } from '@/lib/types';

interface PricingTableProps {
    competitors: CompetitorAnalysis[];
}

export function PricingTable({ competitors }: PricingTableProps) {
    // Get all unique plan names across competitors
    const allPlanNames = Array.from(
        new Set(
            competitors.flatMap((comp) => comp.pricing.plans.map((plan) => plan.name))
        )
    );

    // Find min and max prices for highlighting
    const allPrices = competitors.flatMap((comp) =>
        comp.pricing.plans.map((plan) => {
            const match = plan.price.match(/\$(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })
    );
    const minPrice = Math.min(...allPrices.filter((p) => p > 0));
    const maxPrice = Math.max(...allPrices);

    const getPriceValue = (price: string): number => {
        const match = price.match(/\$(\d+)/);
        return match ? parseInt(match[1]) : 0;
    };

    const getPriceHighlight = (price: string): string => {
        const value = getPriceValue(price);
        if (value === minPrice && value > 0) return 'border-l-4 border-green-500 bg-green-50';
        if (value === maxPrice) return 'border-l-4 border-red-500 bg-red-50';
        return '';
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Plan Tier</TableHead>
                        {competitors.map((comp) => (
                            <TableHead key={comp.url} className="text-center">
                                {comp.competitor}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allPlanNames.map((planName) => (
                        <TableRow key={planName}>
                            <TableCell className="font-medium">{planName}</TableCell>
                            {competitors.map((comp) => {
                                const plan = comp.pricing.plans.find((p) => p.name === planName);
                                return (
                                    <TableCell
                                        key={comp.url}
                                        className={`text-center ${plan ? getPriceHighlight(plan.price) : ''}`}
                                    >
                                        {plan ? (
                                            <div className="space-y-2">
                                                <div className="font-bold text-lg">{plan.price}</div>
                                                <Badge variant="outline">{plan.billing}</Badge>
                                                <div className="text-xs text-gray-500">
                                                    {plan.features.length} features
                                                </div>
                                                <details className="text-left">
                                                    <summary className="cursor-pointer text-xs text-blue-600 hover:underline">
                                                        View features
                                                    </summary>
                                                    <ul className="mt-2 space-y-1 text-xs">
                                                        {plan.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-start gap-1">
                                                                <span className="text-green-600">✓</span>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
