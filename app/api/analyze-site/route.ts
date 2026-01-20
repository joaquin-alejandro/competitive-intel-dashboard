import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, parseAIJSON } from '@/lib/openai';
import { UrlSchema, SiteAnalysis, ApiResponse } from '@/lib/types';
import { sampleSiteAnalysis } from '@/lib/sample-data';
import { getPageSpeedInsights } from '@/lib/pagespeed';
import { scrapeWebsite } from '@/lib/scraper';

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

        // Scrape the website content
        const scraped = await scrapeWebsite(url);
        const pageContent = scraped
            ? `Title: ${scraped.title}\nDescription: ${scraped.description}\nHeadings: ${scraped.h1s.join(', ')}\n\nContent: ${scraped.text}`
            : "Could not fetch website content directly.";

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

Direct Page Content: 
"""
${pageContent}
"""

Instructions:
1. Ignore the brand name if it contradicts the actual content (e.g., if the name is related to finance but the content is about marketing, it's a marketing site).
2. Granular Niche: Identify the specific category (e.g., "Marketing Data Integration", "Automated Reporting for Agencies").
3. Business Model: (e.g., B2B SaaS).
4. Core Value Proposition: The specific problem solved.
5. Target Market: Be specific.

Return ONLY valid JSON:
{
  "industry": "Specific Granular Niche",
  "businessModel": "Business model type",
  "products": ["Product 1", "Product 2", "Product 3"],
  "targetMarket": "Detailed description of target market"
}

No explanatory text outside the JSON.`;

        const response = await callOpenAI(prompt, true);
        const analysis = parseAIJSON<SiteAnalysis>(response.content);
        analysis.url = url;

        // Add PageSpeed Insights
        try {
            const pageSpeed = await getPageSpeedInsights(url);
            if (pageSpeed) {
                analysis.pageSpeed = pageSpeed;
            }
        } catch (psError) {
            console.error('Error fetching PageSpeed for site:', psError);
        }

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
