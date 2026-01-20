import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, parseAIJSON } from '@/lib/openai';
import { UrlSchema, SiteAnalysis, ApiResponse } from '@/lib/types';
import { sampleSiteAnalysis } from '@/lib/sample-data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = UrlSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { url } = validation.data;

        // Check if API key is configured, otherwise return sample data
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
            console.log('Using demo mode - no API key configured');
            return NextResponse.json<ApiResponse<SiteAnalysis>>({
                success: true,
                data: sampleSiteAnalysis,
            });
        }

        // Call OpenAI API to analyze the website
        const prompt = `Analyze this website: ${url}

Search the web to find information about this company and their website.

Identify and extract:
1. Industry/sector they operate in
2. Business model (e.g., SaaS, E-commerce, Marketplace, etc.)
3. Main products or services they offer (list up to 5)
4. Target market/audience

Return ONLY valid JSON with this exact structure:
{
  "industry": "Industry name",
  "businessModel": "Business model type",
  "products": ["Product 1", "Product 2", "Product 3"],
  "targetMarket": "Description of target market"
}

Be concise and accurate. Do not include any explanatory text outside the JSON.`;

        const response = await callOpenAI(prompt, true);
        const analysis = parseAIJSON<SiteAnalysis>(response.content);

        return NextResponse.json<ApiResponse<SiteAnalysis>>({
            success: true,
            data: analysis,
        });
    } catch (error) {
        console.error('Error analyzing site:', error);
        return NextResponse.json<ApiResponse<never>>(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze website'
            },
            { status: 500 }
        );
    }
}
