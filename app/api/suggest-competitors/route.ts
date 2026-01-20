import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, parseAIJSON, getFavicon } from '@/lib/openai';
import { SuggestCompetitorsSchema, Competitor, ApiResponse } from '@/lib/types';
import { sampleCompetitors } from '@/lib/sample-data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = SuggestCompetitorsSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { userSite, industry, businessModel } = validation.data;

        // Check if API key is configured, otherwise return sample data
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
            console.log('Using demo mode - no API key configured');
            return NextResponse.json<ApiResponse<Competitor[]>>({
                success: true,
                data: sampleCompetitors,
            });
        }

        // Call OpenAI API to find competitors
        const prompt = `Find the top 3 most relevant DIRECT competitors for: ${userSite}

Context:
- Industry/Niche: ${industry}
- Business Model: ${businessModel}

Search the web for direct competitors that provide a similar SOLUTION or PRODUCT to the same TARGET MARKET.

CRITICAL RULES:
1. EXCLUDE General Tech Giants: Do NOT suggest Google, OpenAI, Microsoft, AWS, or Apple unless their specific competing product is the primary focus of the comparison (e.g., Google Analytics is a competitor for an analytics tool, but Google is not).
2. PRIORITIZE Mid-market and Niche Players: If the user site is a specialized tool, find other specialized tools in that niche (e.g. for MarTech, look at companies like Supermetrics, Funnel.io, Adverity, etc.).
3. DIRECT COMPETITION: Focus on who the user would lose a deal to.

For each competitor, provide:
1. Company name
2. Website URL
3. Website URL
4. A brief reason why they are a direct competitor (mentioning shared features/market)
5. Similarity score (0-100, relative to product/market fit)

Return ONLY valid JSON:
{
  "competitors": [
    {
      "name": "Company Name",
      "url": "https://example.com",
      "reason": "Specific explanation of product/market overlap",
      "similarity": 85
    }
  ]
}

No explanatory text outside the JSON.`;

        const response = await callOpenAI(prompt, true);
        const parsed = parseAIJSON<{ competitors: Array<Omit<Competitor, 'logo'>> }>(response.content);

        // Fetch favicons for each competitor
        const competitorsWithLogos: Competitor[] = await Promise.all(
            parsed.competitors.map(async (comp) => ({
                ...comp,
                logo: await getFavicon(comp.url),
            }))
        );

        return NextResponse.json<ApiResponse<Competitor[]>>({
            success: true,
            data: competitorsWithLogos,
        });
    } catch (error) {
        console.error('Error suggesting competitors:', error);
        return NextResponse.json<ApiResponse<never>>(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to suggest competitors'
            },
            { status: 500 }
        );
    }
}
