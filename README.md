# 🚀 Aero - Enterprise AI Brand Monitoring & Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**Aero** is a sophisticated real-time brand monitoring and competitive intelligence platform that tracks your brand mentions across AI-powered platforms including ChatGPT, Perplexity, Google AI Overview, and Gemini. Monitor **Amazon products by ASIN** across global marketplaces, build brand knowledge graphs with Cognee Cloud, and surface AI-powered recommendations. Track your digital presence, analyze competitor activity, and optimize your content visibility in the age of AI-powered search.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🎯 What is Aero?](#-what-is-aero)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🔐 Authentication Setup](#-authentication-setup)
- [🤖 AI Provider Configuration](#-ai-provider-configuration)
- [🛒 Amazon ASIN & Product Monitoring](#-amazon-asin--product-monitoring)
- [📡 API Endpoints](#-api-endpoints)
- [🏗️ Architecture](#️-architecture)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 What is Aero?

Aero is an enterprise-grade platform for brand managers, marketing teams, and SEO professionals to:

- **Monitor Brand Mentions** across AI-powered search platforms (ChatGPT, Perplexity, Google AI Overview, Gemini)
- **Track Amazon Products by ASIN** — paste a 10-character ASIN or listing URL, pick a marketplace, and monitor how AI engines talk about your product
- **Track Competitor Activity** with real-time competitive intelligence
- **Analyze AI Citations** to understand how your brand is represented in AI-generated content
- **Process Custom Queries** against multiple AI providers simultaneously
- **Extract Company Intelligence** from domains using AI and web scraping
- **Monitor Lifetime Trends** with historical analytics and visualization
- **Optimize Content** with AI-powered recommendations for better visibility
- **Build Brand Knowledge Graphs** with Cognee Cloud — structured memory from query results, citations, and competitor signals

Think of Aero as **Google Analytics for the AI era** — for website domains and **Amazon ASINs** alike. Track how your brand or product appears in AI-generated responses and which competitors get mentioned alongside you.

## ✨ Features

### 🎯 Core Capabilities

- **🔍 Multi-Platform Monitoring**: Track brand mentions across 6+ AI platforms (ChatGPT, Perplexity, Google AI, Gemini, OpenAI, Azure OpenAI)
- **⚡ Real-time Analytics**: Live tracking of brand visibility and citation trends
- **🏆 Competitive Intelligence**: Identify and track competitor mentions automatically
- **📊 Advanced Analytics**: Detailed insights into mention patterns, sentiment, and domain distribution
- **🔗 Citation Tracking**: See exactly where and how your brand is mentioned in AI responses
- **🛒 Amazon ASIN Monitoring**: Track products by ASIN or listing URL across 10+ Amazon marketplaces (`.com`, `.in`, `.co.uk`, `.de`, and more)
- **📦 Amazon Product Intelligence**: Pull title, bullets, reviews, BSR, and category via Decodo — then auto-discover Amazon competitors with Gemini
- **🔎 Amazon-Only AI Search**: Restrict ChatGPT and Gemini queries to `site:amazon.{marketplace}` for listing-focused visibility analysis
- **📈 Lifetime Trends**: Historical analysis and trend forecasting
- **🎨 Interactive Dashboards**: Beautiful, responsive visualizations with Recharts
- **👥 Multi-Brand Management**: Manage unlimited brands from one platform
- **💳 Credit System**: Usage-based billing with credit tracking
- **🔄 Batch Processing**: Query multiple AI providers in one operation
- **🧠 Cognee Knowledge Graph**: Ingest brand context, cognify relationships, and surface AI recommendations on the dashboard

### 🛠️ Technical Features

- **Next.js 15 + React 19**: Latest React with Server Components and App Router
- **TypeScript**: Full type safety across the entire codebase
- **Firebase/Firestore**: Scalable real-time database with authentication
- **Multi-Provider AI**: Flexible integration with OpenAI, Perplexity, Google APIs, Cognee Cloud, and more
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Radix UI components
- **Real-time Updates**: Live data synchronization and instant notifications
- **Enterprise Security**: Role-based access control, Firebase security rules, and data encryption
- **Custom Components**: Hand-built visualization and rendering components for AI responses

### 🚀 Performance & Scalability

- **Automatic Code Splitting**: Optimized bundle sizes for faster loading
- **Edge Deployment**: Deploy globally with Vercel Edge Functions
- **Smart Caching**: Intelligent caching for API responses and frequently accessed data
- **Batch Query Processing**: Handle hundreds of queries efficiently
- **Provider Fallback System**: Graceful degradation if AI providers are unavailable
- **Rate Limiting**: Built-in protection against API rate limits

## 🚀 Quick Start

Get up and running in less than 5 minutes:

```bash
# Clone the repository
git clone https://github.com/your-org/aero.git
cd aero

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your API keys (see Configuration section below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Firebase Account**: For authentication and Firestore database
- **Cognee Cloud Account**: For knowledge-graph powered recommendations ([platform.cognee.ai](https://platform.cognee.ai))
- **Decodo API Key**: For Amazon ASIN product scraping ([decodo.com](https://decodo.com))
- **AI Provider APIs**: At least one of the following:
  - OpenAI API Key
  - Google Gemini API Key
  - Perplexity API Key (optional)
  - Google AI Overview integration (optional)

## ⚙️ Installation

### 1. Clone and Install

```bash
git clone https://github.com/your-org/aero.git
cd aero
npm install
```

### 2. Environment Setup

Create a `.env.local` file in your project root:

```bash
cp .env.example .env.local
```

### 3. Install Firebase CLI (Optional, for deployment)

```bash
npm install -g firebase-tools
firebase login
```

## 🔧 Configuration

### Environment Variables

#### Required Variables

```env
# Firebase Configuration (Required for authentication and data storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# At least ONE AI Provider (Required)
OPENAI_API_KEY=sk-your_openai_api_key_here
# or
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
# or
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Cognee Cloud

```env
# Cognee Cloud — knowledge graph & AI recommendations
COGNEE_CLOUD_URL=https://your-tenant.aws.cognee.ai
COGNEE_API_KEY=your_cognee_api_key_here
```

#### Amazon ASIN (Decodo)

```env
# Amazon product scraping — required for ASIN-based brand setup
DECODO_API_KEY=your_decodo_api_key_here
```

#### Additional Variables

```env
# Additional AI Providers (Optional)
PERPLEXITY_API_KEY=your_perplexity_key
GOOGLE_AI_API_KEY=your_google_ai_key

# Firebase Admin (For backend operations)
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Other Services (Optional)
DATAFORSEO_USERNAME=your_dataforseo_username
DATAFORSEO_PASSWORD=your_dataforseo_password
SBOT_API_KEY=your_sbot_key
SFLY_API_KEY=your_sfly_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Aero - AI Brand Monitoring
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

## 🔐 Authentication Setup

### Firebase Authentication

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create Project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Create Web App**
   - In your project, click the web icon to create a web app
   - Copy the Firebase config
   - Paste into your `.env.local` as `NEXT_PUBLIC_FIREBASE_*` variables

3. **Enable Authentication Methods**
   - Go to Authentication → Sign-in method
   - Enable **Email/Password**
   - Enable **Google Sign-in** (optional, for easier login)

4. **Set Up Firestore Database**
   - Go to Firestore Database → Create database
   - Start in test mode (or production with security rules)
   - Security rules are in `firestore.rules` (deploy with `firebase deploy --only firestore:rules`)

5. **Configure Security Rules**

The project includes pre-configured Firestore security rules in `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### Authentication Components

The application has comprehensive authentication built-in:

- **`AuthContext`**: Global authentication state management
- **`ProtectedRoute`**: Route protection wrapper for client-side protection
- **`AuthStatus`**: Component showing current auth status with sign-out
- **Dashboard Routes**: All `/dashboard/*` routes are automatically protected

**Usage in Components:**

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

**Admin Route Protection:**

```tsx
<ProtectedRoute 
  requireAdmin={true}
  adminEmails={['admin@example.com']}
>
  <AdminPanel />
</ProtectedRoute>
```

## 🤖 AI Provider Configuration

Aero supports multiple AI providers for redundancy and flexibility:

### OpenAI (Primary Recommended)

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local`:
```env
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Google Gemini

1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to `.env.local`:
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
# Alternative name
GEMINI_API_KEY=your_gemini_api_key_here
```

### Perplexity (Optional)

1. Get API key from [Perplexity](https://www.perplexity.ai/)
2. Add to `.env.local`:
```env
PERPLEXITY_API_KEY=your_perplexity_key_here
```

### Cognee Cloud

Aero integrates [Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) as its knowledge-graph and recommendation engine. Cognee turns raw brand monitoring data — AI responses, citations, competitor co-mentions, and query history — into a structured graph that powers smarter dashboard recommendations.

#### What Cognee does in Aero

| Stage | What happens |
|-------|----------------|
| **Ingest** | After batch query processing, brand context is pushed to a per-brand Cognee dataset |
| **Cognify** | Cognee builds entities and relationships from the ingested text |
| **Search** | The dashboard requests graph-backed recommendations tailored to each brand |
| **Display** | Results render as recommendation cards in the AI Recommendations section |

#### Setup

1. Create an account at [platform.cognee.ai](https://platform.cognee.ai)
2. Generate an API key from the dashboard (copy your tenant URL from the API Keys page)
3. Add credentials to `.env.local`:

```env
COGNEE_CLOUD_URL=https://your-tenant.aws.cognee.ai
COGNEE_API_KEY=your_cognee_api_key_here
```

#### Code layout

| Path | Purpose |
|------|---------|
| `src/lib/cognee/cognee-client.ts` | REST client — `add`, `cognify`, `remember`, `search` |
| `src/lib/cognee/sync-brand-context.ts` | Builds and syncs brand documents after query runs |
| `src/lib/cognee/format-recommendations.ts` | Maps Cognee search output to dashboard cards |
| `src/hooks/useCogneeRecommendations.ts` | Client hook for the recommendations API |
| `src/app/api/cognee/` | Server routes for recommendations, sync, and status |

#### Data flow

```
Query batch completes (process-user-queries)
        ↓
Brand context document built (mentions, citations, competitors)
        ↓
Cognee remember → cognify (per-brand dataset: aero-brand-{id})
        ↓
Dashboard requests /api/cognee/recommendations
        ↓
Cognee GRAPH_COMPLETION search → recommendation cards
```

#### Verify connection

```bash
# With the dev server running
curl http://localhost:3000/api/cognee/status
```

See the [Cognee API reference](https://docs.cognee.ai/api-reference/introduction) for endpoint details.

### Provider Configuration Architecture

- **Base Provider**: `src/lib/api-providers/base-provider.ts` - Abstract base class
- **Provider Manager**: `src/lib/api-providers/provider-manager.ts` - Orchestrates multiple providers
- **Cognee Client**: `src/lib/cognee/` - Knowledge graph ingest, sync, and recommendation search
- **Amazon ASIN Client**: `src/lib/amazon-product-context.ts` - ASIN parsing, Decodo scrape, product context
- **Provider Implementations**: Individual provider classes for each platform
- **Fallback System**: Automatically tries next provider if one fails

### Testing Provider Configuration

```bash
# Test all configured providers
npm run dev
# Then navigate to /api/debug-providers
```

## 🛒 Amazon ASIN & Product Monitoring

Aero is built for **both website brands and Amazon sellers**. The default brand onboarding flow starts with Amazon — enter a **10-character ASIN** or paste a full **Amazon listing URL**, choose a marketplace, and Aero builds a complete product context for AI visibility tracking.

### What Amazon ASIN mode does

| Capability | Details |
|------------|---------|
| **ASIN input** | Accepts raw ASIN (`B07XXXXXXXXX`) or URLs (`/dp/`, `/gp/product/`, `?asin=`) |
| **Marketplaces** | US, India, UK, Canada, Germany, France, Italy, Spain, Australia, Japan |
| **Product scrape** | Decodo fetches title, brand, bullets, description, price, rating, reviews, BSR, images |
| **Competitor discovery** | Gemini finds 4–8 direct Amazon competitors for the ASIN |
| **Amazon-only search** | When enabled, AI queries are scoped to `site:amazon.{marketplace}` |
| **Batch monitoring** | `process-user-queries` injects ASIN + product context into every AI prompt |

### Brand setup flow

```
Dashboard → Add Brand → Step 1 (Amazon tab — default)
        ↓
Enter ASIN or listing URL + select marketplace
        ↓
POST /api/get-amazon-product-context (Decodo scrape + competitor enrichment)
        ↓
Step 2: Review product context, generate buyer-journey queries
        ↓
Step 3: Run batch queries with Amazon product context attached
        ↓
Analytics: mentions, citations, competitor co-appears on AI + Amazon surfaces
```

### Amazon-only search mode

Enable **"Ask AI engines to search Amazon only"** during setup. When active:

- Provider queries append `site:amazon.{marketplace}` (e.g. `site:amazon.com`)
- AI responses prioritize Amazon listings, search results, reviews, and Q&A
- Product title, ASIN, category, and Amazon URL are injected into every prompt

### Setup

1. Get a Decodo API key for Amazon product scraping
2. Add to `.env.local`:

```env
DECODO_API_KEY=your_decodo_api_key_here
```

3. In the dashboard, go to **Add Brand** and use the **Amazon** tab (default)

### Code layout

| Path | Purpose |
|------|---------|
| `src/lib/amazon-product-context.ts` | ASIN extraction, Decodo scrape, product → company info mapping |
| `src/app/api/get-amazon-product-context/route.ts` | API route for product context + competitor enrichment |
| `src/app/dashboard/add-brand/step-1/page.tsx` | Amazon / website source picker, marketplace selector, ASIN input |
| `src/app/api/process-user-queries/route.ts` | Injects Amazon context and `site:` constraints into batch queries |
| `src/firebase/firestore/getUserBrands.ts` | Persists `amazonAsin`, `amazonProduct`, `amazonOnlySearch` on brand records |

### Stored brand fields

```ts
sourceType: 'amazon' | 'website'
amazonAsin: string
amazonOnlySearch: boolean
amazonProduct: { asin, title, brand, category, price, rating, reviewsCount, bulletPoints, ... }
```

## 📡 API Endpoints

Aero exposes comprehensive REST APIs for brand monitoring:

### Core Query Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai-query` | POST | Execute AI queries across multiple providers with priority handling |
| `/api/user-query` | POST/GET | Query specific AI providers and fetch query history |
| `/api/process-user-queries` | POST | Batch process multiple queries with Amazon context support |

### Cognee Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cognee/recommendations` | GET | Fetch graph-backed AI recommendations for a brand |
| `/api/cognee/sync` | POST | Manually sync brand context to Cognee |
| `/api/cognee/status` | GET | Check Cognee connection and configuration |

### Amazon ASIN Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/get-amazon-product-context` | POST | Scrape Amazon product by ASIN/URL, enrich competitors, return brand-ready context |
| `/api/process-user-queries` | POST | Batch process queries with Amazon ASIN context and `site:amazon.*` scoping |

### Company & Domain Intelligence

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/get-company-info` | POST | Extract company data (name, description, competitors) from domain |
| `/api/get-domain-metadata` | POST | Fetch domain metadata via HTML scraping |

### Admin & Testing

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate-brand-data` | POST | Generate seed data for testing |
| `/api/debug-providers` | GET | Debug active AI providers |
| `/api/test-chatgptsearch` | GET/POST | Test ChatGPT integration |
| `/api/test-perplexity` | GET/POST | Test Perplexity integration |
| `/api/test-google-ai-overview` | GET/POST | Test Google AI Overview |
| `/api/test-firestore` | GET/POST | Test Firestore connection |

**Example API Calls:**

```bash
# Get company info from a domain
curl -X POST http://localhost:3000/api/get-company-info \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# Get Amazon product context from ASIN
curl -X POST http://localhost:3000/api/get-amazon-product-context \
  -H "Content-Type: application/json" \
  -d '{
    "asinOrUrl": "B07XXXXXXXXX",
    "marketplaceDomain": "com",
    "amazonOnlySearch": true
  }'

# Execute AI query
curl -X POST http://localhost:3000/api/ai-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What companies are in the SaaS space?",
    "providers": ["openai", "gemini"]
  }'

# Process user queries in batch
curl -X POST http://localhost:3000/api/process-user-queries \
  -H "Content-Type: application/json" \
  -d '{
    "queries": ["What is Nike?", "Who competes with Nike?"],
    "brand": "Nike"
  }'
```

## 🏗️ Architecture

### Folder Structure

```
aero/
├── src/
│   ├── app/
│   │   ├── api/                    # REST API endpoints
│   │   ├── dashboard/              # Main dashboard app
│   │   │   ├── analytics/          # Brand analytics views
│   │   │   ├── competitors/        # Competitor analysis
│   │   │   ├── citations/          # Citation tracking
│   │   │   ├── queries/            # Query history
│   │   │   └── add-brand/          # Brand management (Amazon ASIN + website onboarding)
│   │   ├── signin/                 # Authentication pages
│   │   ├── signup/
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── features/               # Feature components
│   │   │   ├── BrandAnalyticsDisplay.tsx
│   │   │   ├── CompetitorMentionsCard.tsx
│   │   │   ├── CitationsTable.tsx
│   │   │   ├── ChatGPTResponseRenderer.tsx
│   │   │   ├── PerplexityResponseRenderer.tsx
│   │   │   ├── GoogleAIOverviewRenderer.tsx
│   │   │   └── ...
│   │   ├── auth/                   # Authentication components
│   │   ├── layout/                 # Layout components
│   │   └── shared/                 # Shared UI components
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── BrandContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/                      # Custom React hooks (15+ hooks)
│   │   ├── useAIQuery.ts
│   │   ├── useBrandAnalytics.ts
│   │   ├── useCompetitors.ts
│   │   ├── useDashboardData.ts
│   │   ├── useCogneeRecommendations.ts
│   │   └── ...
│   ├── lib/
│   │   ├── api-providers/          # AI provider integrations
│   │   ├── cognee/                 # Cognee Cloud client, sync, recommendations
│   │   ├── amazon-product-context.ts  # ASIN parsing, Decodo scrape, product mapping
│   │   ├── domain-analyzer/        # Domain analysis utilities
│   │   ├── auth/                   # Auth utilities
│   │   └── ...
│   ├── firebase/
│   │   ├── config.ts               # Firebase configuration
│   │   ├── firebase-admin.ts       # Admin SDK
│   │   ├── auth/                   # Auth functions
│   │   ├── firestore/              # Firestore utilities
│   │   └── storage/                # Storage utilities
│   └── middleware.ts               # Next.js middleware
├── public/                         # Static assets
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Firestore indexes
├── firebase.json                   # Firebase configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 15, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Radix UI |
| **State Management** | React Query (TanStack), React Context |
| **Database** | Firebase/Firestore |
| **Authentication** | Firebase Auth |
| **Data Visualization** | Recharts, custom components |
| **AI Integration** | OpenAI, Gemini, Perplexity, Cognee Cloud, Decodo (Amazon) APIs |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **HTTP Client** | Fetch API with custom middleware |

### Data Flow

**Website brand path:**

```
User Input (domain)
    ↓
Dashboard Components
    ↓
Custom Hooks (useAIQuery, useBrandAnalytics, etc.)
    ↓
React Query (Client-side caching)
    ↓
API Endpoints (/api/*)
    ↓
Provider Manager (routes to correct AI provider)
    ↓
AI Provider APIs (OpenAI, Gemini, Perplexity, etc.)
    ↓
Firestore Database (stores results)
    ↓
Cognee Cloud (ingest → cognify → search for recommendations)
    ↓
Components render with React Query
```

**Amazon ASIN path:**

```
User Input (ASIN or listing URL + marketplace)
    ↓
/api/get-amazon-product-context (Decodo scrape + Gemini competitors)
    ↓
Brand record with amazonAsin, amazonProduct, amazonOnlySearch
    ↓
Buyer-journey queries generated (Step 2)
    ↓
/api/process-user-queries (Amazon context + site:amazon.* in prompts)
    ↓
ChatGPT Search + Gemini (Amazon-scoped when enabled)
    ↓
Firestore + Cognee sync → dashboard analytics & recommendations
```

## 🎯 Key Features Deep Dive

### 1. Multi-Provider Query Orchestration

Execute queries against multiple AI platforms simultaneously:

```tsx
const { data, isLoading } = useAIQuery({
  query: "What companies are disrupting the SaaS space?",
  providers: ['openai', 'gemini', 'perplexity']
});
```

### 2. Real-Time Brand Analytics

Track brand mentions with detailed metrics:

```tsx
const { analytics, loading } = useBrandAnalytics(brandId);
// Returns: mention count, top domains, competitor mentions, trends
```

### 3. Citation Tracking

See exactly where your brand appears in AI-generated content:

```tsx
const { citations, total } = useLifetimeCitations(brandId);
// Each citation includes: provider, timestamp, context, domain
```

### 4. Competitor Intelligence

Automatically identify and track competitor mentions:

```tsx
const { competitors, analysis } = useCompetitorAnalytics(brandId);
// Get: mention frequency, co-mention patterns, market position
```

### 5. Domain Intelligence

Extract comprehensive company information from any domain:

```tsx
const companyInfo = await getCompanyInfo('example.com');
// Returns: company name, description, products, competitors, keywords
```

### 6. Cognee-Powered Recommendations

Graph-backed recommendations on the dashboard, driven by accumulated brand monitoring data:

```tsx
const { recommendations, source } = useCogneeRecommendations({
  brandId: selectedBrandId,
  brandName: selectedBrand?.companyName,
});
// Returns: title, description, priority, category — from Cognee search
```

Brand context syncs automatically after each query batch via `syncBrandContextToCognee` in `process-user-queries`.

### 7. Amazon ASIN Product Monitoring

First-class support for Amazon sellers — track any product by ASIN across global marketplaces:

```tsx
// Step 1: Fetch product context from ASIN
const response = await fetch('/api/get-amazon-product-context', {
  method: 'POST',
  body: JSON.stringify({
    asinOrUrl: 'B07XXXXXXXXX',       // or full Amazon URL
    marketplaceDomain: 'com',         // com, in, co.uk, de, ...
    amazonOnlySearch: true,           // scope AI queries to site:amazon.com
  }),
});
// Returns: title, brand, bullets, category, price, rating, reviews, competitors

// Stored on brand record and used in batch processing:
// sourceType: 'amazon', amazonAsin, amazonProduct, amazonOnlySearch
```

**Supported ASIN input formats:**

- Raw ASIN: `B07XXXXXXXXX`
- `/dp/B07XXXXXXXXX`
- `/gp/product/B07XXXXXXXXX`
- `?asin=B07XXXXXXXXX`

When `amazonOnlySearch` is enabled, every batch query is rewritten with `site:amazon.{marketplace}` and full product context (title, ASIN, category, Amazon URL) so AI engines answer from Amazon surfaces.

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Connect your Git repository
# Push to main branch
git push origin main

# Vercel automatically deploys
# Add environment variables in Vercel dashboard
```

### Firebase Hosting

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy

# Deploy only specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

### Docker Deployment

```bash
# Build Docker image
docker build -t aero .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production aero
```

### Environment Variables for Production

In your deployment platform, add all required environment variables:
- `NEXT_PUBLIC_FIREBASE_*` (all Firebase config)
- `OPENAI_API_KEY` (or other provider keys)
- `COGNEE_CLOUD_URL` and `COGNEE_API_KEY`
- `DECODO_API_KEY` (Amazon ASIN product scraping)
- `FIREBASE_PRIVATE_KEY` (for backend operations)

## 🧪 Testing

### Run Development Server with Testing

```bash
npm run dev
```

### Test API Endpoints

Navigate to the following in your browser to test providers:

- `http://localhost:3000/api/debug-providers` - Check active providers
- `http://localhost:3000/api/test-chatgptsearch` - Test ChatGPT
- `http://localhost:3000/api/test-perplexity` - Test Perplexity
- `http://localhost:3000/api/test-google-ai-overview` - Test Google AI
- `http://localhost:3000/api/test-firestore` - Test Firestore
- `http://localhost:3000/api/cognee/status` - Check Cognee connection

### Unit Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Troubleshooting

### Common Issues

**Issue: "Firebase initialization failed"**
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
- Verify your Firebase project is active and Web app is created
- Clear browser cache and restart dev server

**Issue: "AI Provider not responding"**
- Verify API key is correct in `.env.local`
- Check API key has appropriate permissions
- Test with `http://localhost:3000/api/debug-providers`
- Check provider status page

**Issue: "Firestore permission denied"**
- Ensure security rules are deployed: `firebase deploy --only firestore:rules`
- Check user is authenticated
- Verify Firestore database is in correct region

**Issue: "Next.js build fails"**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Debugging

**Enable Debug Mode:**
Add to `.env.local`:
```env
DEBUG=aero:*
```

**Check Firebase Connection:**
```bash
firebase status
firebase emulators:start
```

**Monitor API Calls:**
Check browser DevTools → Network tab to see API requests and responses

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

Please ensure your code follows the TypeScript and ESLint conventions used in the project.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## 🚀 Quick Links

- 📖 [Full Documentation](https://docs.aero.app)
- 🐛 [Report Issues](https://github.com/your-org/aero/issues)
- 💬 [Discussions](https://github.com/your-org/aero/discussions)
- 📧 [Contact Support](mailto:support@aero.app)

## 🎉 Acknowledgements

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend & database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Data visualization
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [React Query](https://tanstack.com/query/) - Data fetching

---

**Made with ❤️ by the Aero Team**
