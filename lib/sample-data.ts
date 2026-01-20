import { CompetitorAnalysis } from './types';

export const sampleData: CompetitorAnalysis[] = [
    {
        competitor: 'Example Competitor A',
        url: 'https://example-a.com',
        pricing: {
            plans: [
                {
                    name: 'Starter',
                    price: '$29/mo',
                    billing: 'monthly',
                    features: ['10 users', 'Basic support', '5GB storage', 'Email integration'],
                },
                {
                    name: 'Professional',
                    price: '$79/mo',
                    billing: 'monthly',
                    features: [
                        '50 users',
                        'Priority support',
                        '50GB storage',
                        'Advanced analytics',
                        'API access',
                    ],
                },
                {
                    name: 'Enterprise',
                    price: '$199/mo',
                    billing: 'monthly',
                    features: [
                        'Unlimited users',
                        '24/7 support',
                        'Unlimited storage',
                        'Custom integrations',
                        'Dedicated account manager',
                    ],
                },
            ],
        },
        products: ['Product Analytics', 'Dashboard Builder', 'Report Generator'],
        messaging: {
            headline: 'Analytics Made Simple',
            valueProposition: 'Get insights without complexity',
            targetAudience: 'Small businesses and startups',
            differentiators: ['Easy setup', 'Affordable pricing', 'Beautiful dashboards'],
        },
        insights: {
            strengths: ['User-friendly interface', 'Competitive pricing', 'Fast onboarding'],
            positioning: 'Budget-friendly analytics for small teams',
            strategy: 'Focus on simplicity and affordability to attract SMBs',
        },
    },
    {
        competitor: 'Example Competitor B',
        url: 'https://example-b.com',
        pricing: {
            plans: [
                {
                    name: 'Basic',
                    price: '$49/mo',
                    billing: 'monthly',
                    features: ['25 users', 'Standard support', '20GB storage', 'Basic reports'],
                },
                {
                    name: 'Growth',
                    price: '$129/mo',
                    billing: 'monthly',
                    features: [
                        '100 users',
                        'Priority support',
                        '100GB storage',
                        'Advanced reports',
                        'Custom branding',
                    ],
                },
                {
                    name: 'Scale',
                    price: '$299/mo',
                    billing: 'monthly',
                    features: [
                        'Unlimited users',
                        'White-glove support',
                        'Unlimited storage',
                        'AI-powered insights',
                        'Enterprise SLA',
                    ],
                },
            ],
        },
        products: ['Business Intelligence', 'Data Warehouse', 'Predictive Analytics', 'ML Models'],
        messaging: {
            headline: 'Enterprise-Grade Intelligence',
            valueProposition: 'Scale your data operations with confidence',
            targetAudience: 'Mid-market and enterprise companies',
            differentiators: ['Enterprise security', 'Advanced AI', 'Scalable infrastructure'],
        },
        insights: {
            strengths: ['Robust feature set', 'Enterprise credibility', 'Advanced capabilities'],
            positioning: 'Premium solution for growing companies',
            strategy: 'Target mid-market with enterprise features at accessible price points',
        },
    },
    {
        competitor: 'Example Competitor C',
        url: 'https://example-c.com',
        pricing: {
            plans: [
                {
                    name: 'Free',
                    price: '$0/mo',
                    billing: 'monthly',
                    features: ['5 users', 'Community support', '1GB storage', 'Basic dashboards'],
                },
                {
                    name: 'Pro',
                    price: '$99/mo',
                    billing: 'monthly',
                    features: [
                        '50 users',
                        'Email support',
                        '25GB storage',
                        'Custom dashboards',
                        'Export data',
                    ],
                },
                {
                    name: 'Business',
                    price: '$249/mo',
                    billing: 'monthly',
                    features: [
                        '200 users',
                        'Phone support',
                        '200GB storage',
                        'White labeling',
                        'Advanced permissions',
                        'SSO',
                    ],
                },
            ],
        },
        products: ['Real-time Analytics', 'Customer Insights', 'Marketing Attribution', 'A/B Testing'],
        messaging: {
            headline: 'Real-Time Insights for Modern Teams',
            valueProposition: 'Make data-driven decisions in real-time',
            targetAudience: 'Digital-first companies and marketing teams',
            differentiators: ['Real-time data', 'Marketing focus', 'Freemium model'],
        },
        insights: {
            strengths: ['Real-time capabilities', 'Marketing-specific features', 'Free tier for acquisition'],
            positioning: 'Modern analytics for digital marketing teams',
            strategy: 'Freemium model to drive adoption, upsell on advanced features',
        },
    },
];

export const sampleSiteAnalysis = {
    url: 'https://example.com',
    industry: 'Business Analytics & Intelligence',
    businessModel: 'SaaS (Software as a Service)',
    products: ['Analytics Platform', 'Data Visualization', 'Reporting Tools'],
    targetMarket: 'Small to medium-sized businesses',
};

export const sampleCompetitors = [
    {
        name: 'Example Competitor A',
        url: 'https://example-a.com',
        logo: 'https://www.google.com/s2/favicons?domain=example-a.com&sz=64',
        reason: 'Direct competitor in the SMB analytics space with similar pricing and feature set',
        similarity: 92,
    },
    {
        name: 'Example Competitor B',
        url: 'https://example-b.com',
        logo: 'https://www.google.com/s2/favicons?domain=example-b.com&sz=64',
        reason: 'Enterprise-focused analytics platform targeting similar use cases with more advanced features',
        similarity: 85,
    },
    {
        name: 'Example Competitor C',
        url: 'https://example-c.com',
        logo: 'https://www.google.com/s2/favicons?domain=example-c.com&sz=64',
        reason: 'Real-time analytics competitor with freemium model and marketing-specific features',
        similarity: 78,
    },
];
