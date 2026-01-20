import { z } from 'zod';

// Zod Schemas for validation
export const UrlSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export const SuggestCompetitorsSchema = z.object({
  userSite: z.string().url(),
  industry: z.string(),
  businessModel: z.string(),
});

export const AnalyzeCompetitorsSchema = z.object({
  competitors: z.array(z.string().url()).min(1, 'At least one competitor required'),
});

// TypeScript Types
export interface PerformanceMetrics {
  score: number;
  lcp: string;
  cls: string;
  tbt: string;
  speedIndex: string;
}

export interface PageSpeedData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: PerformanceMetrics;
}
export interface SiteAnalysis {
  url: string;
  industry: string;
  businessModel: string;
  products: string[];
  targetMarket: string;
  pageSpeed?: PageSpeedData;
}

export interface Competitor {
  name: string;
  url: string;
  logo: string;
  reason: string;
  similarity: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  features: string[];
}

export interface Messaging {
  headline: string;
  valueProposition: string;
  targetAudience: string;
  differentiators: string[];
}

export interface Insights {
  strengths: string[];
  positioning: string;
  strategy: string;
}

export interface CompetitorAnalysis {
  competitor: string;
  url: string;
  pricing: {
    plans: PricingPlan[];
  };
  products: string[];
  messaging: Messaging;
  insights: Insights;
  pageSpeed?: PageSpeedData;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
