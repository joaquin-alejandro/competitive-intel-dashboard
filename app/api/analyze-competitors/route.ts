import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, parseAIJSON } from '@/lib/openai';
import { AnalyzeCompetitorsSchema, CompetitorAnalysis, ApiResponse } from '@/lib/types';
import { sampleData } from '@/lib/sample-data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = AnalyzeCompetitorsSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { competitors } = validation.data;

        // Check if API key is configured, otherwise return sample data
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
            console.log('Using demo mode - no API key configured');
            return NextResponse.json<ApiResponse<CompetitorAnalysis[]>>({
                success: true,
                data: sampleData.slice(0, competitors.length),
            });
        }

        // Analyze each competitor
        const analyses: CompetitorAnalysis[] = [];

        for (const competitorUrl of competitors) {
            try {
                const prompt = `Analyze this competitor website: ${competitorUrl}

Search the web to retrieve information about:
1. Homepage
2. Pricing or plans page
3. About page
4. Products or features page

Extract and analyze:
- All pricing tiers (name, price, billing frequency, key features list)
- All products/services offered
- Main headline and value proposition from homepage
- Target audience description
- Key differentiators that make them unique
- Overall positioning strategy

Return ONLY valid JSON with this exact structure:
{
  "competitor": "Company Name",
  "url": "${competitorUrl}",
  "pricing": {
    "plans": [
      {
        "name": "Plan name",
        "price": "$X/mo",
        "billing": "monthly",
        "features": ["feature1", "feature2", "feature3"]
      }
    ]
  },
  "products": ["Product 1", "Product 2"],
  "messaging": {
    "headline": "Main headline from homepage",
    "valueProposition": "Core value proposition",
    "targetAudience": "Who they target",
    "differentiators": ["Key differentiator 1", "Key differentiator 2"]
  },
  "insights": {
    "strengths": ["Strength 1", "Strength 2"],
    "positioning": "How they position themselves in the market",
    "strategy": "Overall strategic approach"
  }
}

Be thorough and extract all pricing plans completely. Do not include any explanatory text outside the JSON.`;

                const response = await callOpenAI(prompt, true);
                const analysis = parseAIJSON<CompetitorAnalysis>(response.content);
                analyses.push(analysis);
            } catch (error) {
                console.error(`Error analyzing ${competitorUrl}:`, error);
                // Continue with other competitors even if one fails
            }
        }

        if (analyses.length === 0) {
            return NextResponse.json<ApiResponse<never>>(
                { success: false, error: 'Failed to analyze any competitors' },
                { status: 500 }
            );
        }

        return NextResponse.json<ApiResponse<CompetitorAnalysis[]>>({
            success: true,
            data: analyses,
        });
    } catch (error) {
        console.error('Error analyzing competitors:', error);
        return NextResponse.json<ApiResponse<never>>(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze competitors'
            },
            { status: 500 }
        );
    }
}
