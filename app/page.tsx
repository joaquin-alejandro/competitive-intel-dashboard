'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp } from 'lucide-react';
import { SiteAnalysis } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);

  const handleAnalyze = async (submittedUrl?: string) => {
    const urlToAnalyze = submittedUrl || url;
    if (!urlToAnalyze) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToAnalyze }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to analyze website');
        setLoading(false);
        return;
      }

      setAnalysis(data.data);

      // Store analysis in localStorage for next page
      localStorage.setItem('siteAnalysis', JSON.stringify({ url, ...data.data }));
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/competitors');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold">Competitive Intelligence</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover your competitors and analyze their strategy with AI
          </p>
        </div>

        {/* Input Section */}
        {!analysis && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Enter Your Website
              </label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                  className="flex-1 h-10 border-gray-300 focus:border-black focus:ring-black"
                />
                <Button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !url}
                  className="h-10 px-6 bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="py-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600">Analyzing your website...</p>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {analysis && !loading && (
          <div className="border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Analysis Complete
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Industry</div>
                <div className="text-sm">{analysis.industry}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Business Model</div>
                <div className="text-sm">{analysis.businessModel}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Main Products/Services</div>
              <div className="flex flex-wrap gap-2">
                {analysis.products.map((product, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Target Market</div>
              <div className="text-sm">{analysis.targetMarket}</div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full h-10 bg-black hover:bg-gray-800 text-white"
            >
              Continue to Competitors →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
