# Competitive Intelligence Dashboard

A Next.js-based competitive intelligence platform that uses AI to automatically discover competitors and generate comprehensive comparison dashboards.

## 🚀 Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 Turbo to analyze websites and discover competitors
- **Automatic Competitor Discovery**: Suggests 3 relevant competitors based on your industry and business model
- **Comprehensive Dashboard**: Multi-tab interface showing pricing, products, messaging, and strategic insights
- **Demo Mode**: Works without API key using sample data for testing
- **Modern UI**: Built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn/ui

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional for demo mode)

## 🛠️ Installation

1. Clone or navigate to the project directory:
```bash
cd /Users/jamr/.gemini/antigravity/scratch/competitive-intel-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env.local and add your OpenAI API key
OPENAI_API_KEY=your_api_key_here
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📖 Usage

### 1. Analyze Your Website
- Enter your website URL on the landing page
- Click "Analyze" to detect your industry and business model
- Review the analysis results

### 2. Select Competitors
- View 3 AI-suggested competitors
- Add manual competitors if needed
- Select which competitors to analyze

### 3. View Dashboard
- **Overview**: Key metrics and competitor summaries
- **Pricing**: Side-by-side pricing comparison
- **Products**: Product catalogs and comparisons
- **Messaging**: Value propositions and positioning
- **Insights**: AI-generated strategic recommendations

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **AI**: OpenAI API (GPT-4 Turbo)
- **Validation**: Zod
- **Icons**: Lucide React

## 📁 Project Structure

```
competitive-intel-dashboard/
├── app/
│   ├── api/              # API routes
│   ├── competitors/      # Competitor selection page
│   ├── dashboard/        # Dashboard page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Shadcn/ui components
│   ├── CompetitorCard.tsx
│   ├── PricingTable.tsx
│   └── InsightsPanel.tsx
├── lib/
│   ├── openai.ts         # OpenAI client
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utilities
│   └── sample-data.ts    # Demo data
└── .env.local            # Environment variables
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | No (demo mode available) |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

```bash
# Or use Vercel CLI
vercel deploy
```

## 🧪 Demo Mode

The application includes a demo mode that works without an API key:
- Uses pre-configured sample data
- Demonstrates all features
- Perfect for testing and development

## 📝 API Routes

### POST `/api/analyze-site`
Analyzes a website to determine industry, business model, products, and target market.

**Request:**
```json
{
  "url": "https://example.com"
}
```

### POST `/api/suggest-competitors`
Suggests 3 competitors based on the analyzed website.

**Request:**
```json
{
  "userSite": "https://example.com",
  "industry": "SaaS",
  "businessModel": "B2B"
}
```

### POST `/api/analyze-competitors`
Performs deep analysis of competitor websites.

**Request:**
```json
{
  "competitors": [
    "https://competitor1.com",
    "https://competitor2.com"
  ]
}
```

## 🎯 Future Enhancements

- [ ] Rate limiting for API calls
- [ ] Export functionality (PDF/CSV)
- [ ] User authentication
- [ ] Analysis history storage
- [ ] Enhanced mobile responsiveness
- [ ] Keyboard navigation
- [ ] Real-time collaboration

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and OpenAI
