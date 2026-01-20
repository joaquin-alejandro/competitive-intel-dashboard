import { PageSpeedData } from './types';

export async function getPageSpeedInsights(url: string): Promise<PageSpeedData | null> {
    const apiKey = process.env.GOOGLE_PAGESPEED_INSIGHTS_API_KEY || process.env.GOOGLE_API_KEY || process.env.PAGESPEED_API_KEY;

    if (!apiKey) {
        console.warn('PageSpeed API key not found (tried GOOGLE_PAGESPEED_INSIGHTS_API_KEY, GOOGLE_API_KEY, and PAGESPEED_API_KEY)');
        return null;
    }

    try {
        const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
        const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            url
        )}&key=${apiKey}&category=${categories.join('&category=')}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!data.lighthouseResult) {
            console.error('PageSpeed API error:', data.error?.message || 'Unknown error');
            return null;
        }

        const lh = data.lighthouseResult;
        const audits = lh.audits;

        return {
            performance: Math.round(lh.categories.performance.score * 100),
            accessibility: Math.round(lh.categories.accessibility.score * 100),
            bestPractices: Math.round(lh.categories['best-practices'].score * 100),
            seo: Math.round(lh.categories.seo.score * 100),
            metrics: {
                score: Math.round(lh.categories.performance.score * 100),
                lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
                cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
                tbt: audits['total-blocking-time']?.displayValue || 'N/A',
                speedIndex: audits['speed-index']?.displayValue || 'N/A',
            },
        };
    } catch (error) {
        console.error('Error fetching PageSpeed insights:', error);
        return null;
    }
}
