# 🚀 Aero - Enterprise AI Brand Monitoring & Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**Aero** is a sophisticated real-time brand monitoring and competitive intelligence platform that tracks your brand mentions across AI-powered platforms including ChatGPT, Perplexity, Google AI Overview, and Gemini. Monitor your digital presence, analyze competitor activity, and optimize your content visibility in the age of AI-powered search.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🎯 What is Aero?](#-what-is-aero)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🔐 Authentication Setup](#-authentication-setup)
- [🤖 AI Provider Configuration](#-ai-provider-configuration)
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
- **Track Competitor Activity** with real-time competitive intelligence
- **Analyze AI Citations** to understand how your brand is represented in AI-generated content
- **Process Custom Queries** against multiple AI providers simultaneously
- **Extract Company Intelligence** from domains using AI and web scraping
- **Monitor Lifetime Trends** with historical analytics and visualization
- **Manage Amazon Products** with special ASIN tracking and competitor analysis
- **Optimize Content** with AI-powered recommendations for better visibility

Think of Aero as **Google Analytics for the AI era** — tracking how your brand appears in AI-generated responses and what competitors are being mentioned alongside you.

## ✨ Features

### 🎯 Core Capabilities

- **🔍 Multi-Platform Monitoring**: Track brand mentions across 6+ AI platforms (ChatGPT, Perplexity, Google AI, Gemini, OpenAI, Azure OpenAI)
- **⚡ Real-time Analytics**: Live tracking of brand visibility and citation trends
- **🏆 Competitive Intelligence**: Identify and track competitor mentions automatically
- **📊 Advanced Analytics**: Detailed insights into mention patterns, sentiment, and domain distribution
- **🔗 Citation Tracking**: See exactly where and how your brand is mentioned in AI responses
- **🛒 E-commerce Integration**: Special Amazon product tracking with ASIN support
- **📈 Lifetime Trends**: Historical analysis and trend forecasting
- **🎨 Interactive Dashboards**: Beautiful, responsive visualizations with Recharts
- **👥 Multi-Brand Management**: Manage unlimited brands from one platform
- **💳 Credit System**: Usage-based billing with credit tracking
- **🔄 Batch Processing**: Query multiple AI providers in one operation

### 🛠️ Technical Features

- **Next.js 15 + React 19**: Latest React with Server Components and App Router
- **TypeScript**: Full type safety across the entire codebase
- **Firebase/Firestore**: Scalable real-time database with authentication
- **Multi-Provider AI**: Flexible integration with OpenAI, Perplexity, Google APIs, and more
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

#### Optional Variables

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

Aero uses [Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) for knowledge-graph powered AI recommendations.

1. Sign up at [platform.cognee.ai](https://platform.cognee.ai)
2. Create an API key and copy your tenant URL
3. Add to `.env.local`:

```env
COGNEE_CLOUD_URL=https://your-tenant.aws.cognee.ai
COGNEE_API_KEY=your_cognee_api_key_here
```

Integration code lives under `src/lib/cognee/` and `src/app/api/cognee/`. After query processing, brand context is synced to Cognee. The dashboard surfaces Cognee recommendations alongside Firestore data.

### Provider Configuration Architecture

- **Base Provider**: `src/lib/api-providers/base-provider.ts` - Abstract base class
- **Provider Manager**: `src/lib/api-providers/provider-manager.ts` - Orchestrates multiple providers
- **Provider Implementations**: Individual provider classes for each platform
- **Fallback System**: Automatically tries next provider if one fails

### Testing Provider Configuration

```bash
# Test all configured providers
npm run dev
# Then navigate to /api/debug-providers
```

## 📡 API Endpoints

Aero exposes comprehensive REST APIs for brand monitoring:

### Core Query Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai-query` | POST | Execute AI queries across multiple providers with priority handling |
| `/api/user-query` | POST/GET | Query specific AI providers and fetch query history |
| `/api/process-user-queries` | POST | Batch process multiple queries with Amazon context support |

### Company & Domain Intelligence

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/get-company-info` | POST | Extract company data (name, description, competitors) from domain |
| `/api/get-domain-metadata` | POST | Fetch domain metadata via HTML scraping |
| `/api/get-amazon-product-context` | POST | Retrieve Amazon product details and competitors |

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
│   │   │   └── add-brand/          # Brand management
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
│   │   └── ...
│   ├── lib/
│   │   ├── api-providers/          # AI provider integrations
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
| **AI Integration** | OpenAI, Gemini, Perplexity APIs |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **HTTP Client** | Fetch API with custom middleware |

### Data Flow

```
User Input
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
Components render with React Query
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

### 6. Amazon Integration

Special support for e-commerce brands:

```tsx
const amazonContext = await getAmazonProductContext({
  asin: 'B07XXXXXXXXX',
  competitors: true
});
```

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
- `FIREBASE_PRIVATE_KEY` (for backend operations)
- Any other optional keys

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
