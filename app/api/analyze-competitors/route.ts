import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, parseAIJSON } from '@/lib/openai';
import { AnalyzeCompetitorsSchema, CompetitorAnalysis, ApiResponse } from '@/lib/types';
import { sampleData } from '@/lib/sample-data';
import { getPageSpeedInsights } from '@/lib/pagespeed';
import { scrapeWebsite } from '@/lib/scraper';

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
                // Scrape competitor website
                const scraped = await scrapeWebsite(competitorUrl);
                const pageContent = scraped
                    ? `Title: ${scraped.title}\nDescription: ${scraped.description}\nHeadings: ${scraped.h1s.join(', ')}\n\nContent: ${scraped.text}`
                    : "Could not fetch website content directly. Rely on web search.";

                const prompt = `Analyze this competitor website: ${competitorUrl}

Direct Page Content:
"""
${pageContent}
"""

Instructions:
1. Ignore the brand name if it contradicts the actual content.
2. Extract all pricing tiers (name, price, billing frequency, key features list).
3. Identify all products/services offered.
4. Extract the main headline and value proposition.
5. Identify the target audience and key differentiators.

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

                // Add PageSpeed Insights
                try {
                    const pageSpeed = await getPageSpeedInsights(competitorUrl);
                    if (pageSpeed) {
                        analysis.pageSpeed = pageSpeed;
                    }
                } catch (psError) {
                    console.error(`Error fetching PageSpeed for ${competitorUrl}:`, psError);
                }

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
