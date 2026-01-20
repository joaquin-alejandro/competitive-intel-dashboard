import * as cheerio from 'cheerio';

export interface ScrapedContent {
    title: string;
    description: string;
    text: string;
    h1s: string[];
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.statusText}`);
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other non-content elements
        $('script, style, nav, footer, iframe, noscript').remove();

        const title = $('title').text().trim();
        const description = $('meta[name="description"]').attr('content')?.trim() || '';

        const h1s: string[] = [];
        $('h1').each((_, el) => {
            const text = $(el).text().trim();
            if (text) h1s.push(text);
        });

        // Extract body text, limit to first 3000 chars to avoid token limits
        const text = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 3000);

        return {
            title,
            description,
            text,
            h1s,
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}
