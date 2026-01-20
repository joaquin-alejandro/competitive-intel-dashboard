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
        const prompt = `Find the top 3 main competitors for this website: ${userSite}

Context:
- Industry: ${industry}
- Business Model: ${businessModel}

Search the web to find the most relevant direct competitors. For each competitor, provide:
1. Company name
2. Website URL
3. A brief reason why they are a competitor (1-2 sentences)
4. Similarity score (0-100, where 100 is most similar)

Return ONLY valid JSON with this exact structure:
{
  "competitors": [
    {
      "name": "Company Name",
      "url": "https://example.com",
      "reason": "Brief explanation of why they are a competitor",
      "similarity": 85
    }
  ]
}

Focus on direct competitors with similar products/services and target markets. Do not include any explanatory text outside the JSON.`;

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
