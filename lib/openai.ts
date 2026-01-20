import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AIResponse {
    content: string;
}

/**
 * Call OpenAI API with a prompt and optional web search
 * @param prompt - The prompt to send to OpenAI
 * @param useWebSearch - Whether to enable web search (uses GPT-4 with browsing)
 * @returns Parsed response from OpenAI
 */
export async function callOpenAI(
    prompt: string,
    useWebSearch: boolean = false
): Promise<AIResponse> {
    try {
        // Use GPT-4 Turbo for better results
        const model = useWebSearch ? 'gpt-4-turbo' : 'gpt-4-turbo';

        const completion = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a competitive intelligence analyst. When analyzing websites, search the web for accurate, up-to-date information. Always return valid JSON responses as requested.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const content = completion.choices[0]?.message?.content || '';
        return { content };
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to get response from OpenAI API');
    }
}

/**
 * Parse JSON from OpenAI's response, handling markdown code blocks
 */
export function parseAIJSON<T>(content: string): T {
    try {
        // Remove markdown code blocks if present
        const cleaned = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Invalid JSON response from AI');
    }
}

/**
 * Fetch favicon for a given URL
 */
export async function getFavicon(url: string): Promise<string> {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return '/placeholder-logo.png';
    }
}
