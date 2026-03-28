<p align="center">
  <h1 align="center">📰 The AI Times</h1>
  <p align="center">
    <strong>AI-Powered Business Intelligence Platform</strong>
  </p>
  <p align="center">
    An autonomous news intelligence platform that fetches, synthesizes, vectorizes, and personalizes business news using AI agents powered by Google Gemini.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/AI_SDK-v6-FF6F00?style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 🎯 What is The AI Times?

The AI Times is a **full-stack AI news intelligence platform** that goes beyond simple news aggregation. It combines:

- **Autonomous AI Agents** that fetch real-time news from RSS feeds, synthesize content using Gemini, and ingest articles with 768-dimensional vector embeddings
- **Personalized Feeds** using cosine similarity search between user interest vectors and article embeddings
- **RAG-Powered Chat** (Retrieval-Augmented Generation) that lets users query their personalized intelligence database in natural language

Think of it as a **Bloomberg Terminal meets AI** — built for the modern web.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Landing  │  │  Login   │  │Onboarding│  │  Dashboard   │   │
│  │  Page    │  │  Page    │  │  Flow    │  │   Shell      │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────┬───────┘   │
│                                                     │           │
│                    ┌────────────────────────────────┼──────┐    │
│                    │         Dashboard Routes       │      │    │
│                    │  ┌─────┐ ┌─────┐ ┌─────┐ ┌────┴──┐  │    │
│                    │  │Main │ │Video│ │ Arc │ │Agent  │  │    │
│                    │  │Feed │ │Studio│ │Track│ │Chat   │  │    │
│                    │  └─────┘ └─────┘ └─────┘ └───────┘  │    │
│                    └─────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Server Actions / API Routes
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER (Next.js 16)                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   AI Agent Engine                        │   │
│  │                                                         │   │
│  │  ┌──────────┐    ┌──────────────┐   ┌───────────────┐  │   │
│  │  │ RAG      │───▶│ Gemini 2.0   │──▶│ Tool Calling  │  │   │
│  │  │ Context  │    │ Flash        │   │ (Autonomous)  │  │   │
│  │  └──────────┘    └──────────────┘   └───────┬───────┘  │   │
│  │                                              │          │   │
│  │  ┌───────────────────────────────────────────┼────────┐ │   │
│  │  │            Agent Tools                    │        │ │   │
│  │  │  ┌─────────────┐  ┌──────────────────┐   │        │ │   │
│  │  │  │fetchLiveNews│  │ingestToDatabase  │◀──┘        │ │   │
│  │  │  │ (RSS Parse) │  │ (Vectorize+Save) │            │ │   │
│  │  │  └──────┬──────┘  └────────┬─────────┘            │ │   │
│  │  └─────────┼──────────────────┼───────────────────────┘ │   │
│  └────────────┼──────────────────┼─────────────────────────┘   │
│               │                  │                               │
└───────────────┼──────────────────┼───────────────────────────────┘
                │                  │
                ▼                  ▼
┌──────────────────┐    ┌──────────────────────────────────────────┐
│   External RSS   │    │              Supabase                     │
│                  │    │                                          │
│ • ET Markets     │    │  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│ • ET Tech        │    │  │ articles │  │ profiles │  │ user_ │ │
│ • Google News    │    │  │ + vector │  │ + vector │  │ acti- │ │
│                  │    │  │ embedding│  │ embedding│  │ vity  │ │
│                  │    │  └──────────┘  └──────────┘  └───────┘ │
│                  │    │                                          │
│                  │    │  ┌──────────────────────────────────┐   │
│                  │    │  │ match_articles() — pgvector RPC  │   │
│                  │    │  │ Cosine Similarity Search         │   │
│                  │    │  └──────────────────────────────────┘   │
└──────────────────┘    └──────────────────────────────────────────┘
```

---

## 🤖 AI Agent Architecture

The autonomous News Agent uses **Gemini 2.0 Flash with Tool Calling** to decide what actions to take based on user commands.

### Agent Workflow

```
User Command: "Fetch the latest AI news and save it"
                    │
                    ▼
        ┌───────────────────────┐
        │  1. RAG Context       │  Query user's existing articles
        │     Retrieval         │  via vector similarity search
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  2. Gemini Reasoning  │  Analyze command + context
        │     + Planning        │  Decide which tools to use
        └───────────┬───────────┘
                    │
            ┌───────┴───────┐
            ▼               ▼
   ┌─────────────┐  ┌──────────────┐
   │ fetchLive   │  │ ingestTo     │
   │ News        │  │ Database     │
   │             │  │              │
   │ Parse ET    │  │ Gemini       │
   │ RSS feeds   │  │ text-embed   │
   │ Return      │  │ -004 → 768D  │
   │ articles    │  │ vector →     │
   │             │  │ Supabase     │
   └─────────────┘  └──────────────┘
            │               │
            └───────┬───────┘
                    ▼
        ┌───────────────────────┐
        │  3. Final Response    │  "I fetched 5 articles about
        │     Generation        │   AI and saved them to your
        │                       │   intelligence database."
        └───────────────────────┘
```

### Tool Capabilities

| Tool | Description | Trigger |
|------|-------------|---------|
| `fetchLiveNews` | Fetches real-time articles from Economic Times RSS feeds (Markets, Tech) | "Fetch", "Find", "Get news about..." |
| `ingestToDatabase` | Vectorizes content with `text-embedding-004` (768D) and saves to Supabase | Automatically called after fetch |
| `getPersonalizedNews` | Finds articles matching user's interest vector via cosine similarity | "What's new for me?", "My feed" |
| `checkDatabase` | Reports current article count and recent entries | "What's in the database?" |

---

## 📁 Project Structure

```
aieinews/
├── app/
│   ├── layout.tsx                 # Root layout with full SEO metadata
│   ├── page.tsx                   # Public landing page
│   ├── globals.css                # Global styles
│   │
│   ├── actions/
│   │   ├── agent.ts               # 🤖 AI Agent (RAG + Gemini tool calling)
│   │   ├── activity.ts            # 📊 User activity tracking
│   │   ├── news.ts                # 📰 Manual article ingestion
│   │   ├── profile.ts             # 👤 Profile management
│   │   └── user.ts                # 🔑 Onboarding & preference vectorization
│   │
│   ├── api/agent/ingest/
│   │   └── route.ts               # 🔌 Cron/webhook endpoint for batch ingestion
│   │
│   ├── auth/callback/
│   │   └── route.ts               # 🔐 Supabase OAuth code exchange
│   │
│   ├── dashboard/
│   │   ├── page.tsx               # Main intelligence dashboard
│   │   ├── loading.tsx            # Skeleton loading state
│   │   ├── navigator/             # AI Agent chat interface
│   │   │   ├── page.tsx           # Server component (auth wrapper)
│   │   │   └── NavigatorChat.tsx  # Client component (chat UI)
│   │   ├── analytics/             # Usage analytics & charts
│   │   ├── video/                 # Video Studio (Coming Soon)
│   │   ├── arc/                   # Story Arc Tracker
│   │   ├── profile/               # User profile & preferences
│   │   └── my-et/                 # Saved articles
│   │
│   ├── login/page.tsx             # Authentication page
│   └── onboarding/page.tsx        # Interest selection + vector generation
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client (@supabase/ssr)
│   │   └── server.ts              # Server client (@supabase/ssr)
│   ├── env.ts                     # Zod environment validation
│   ├── logger.ts                  # Logging utility
│   ├── news-fetcher.ts            # RSS feed parser (rss-parser)
│   ├── types.ts                   # Shared TypeScript types
│   └── utils.ts                   # cn() utility for Tailwind
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardShell.tsx     # Sidebar + navigation shell
│   │   └── AnalyticsChart.tsx     # Recharts wrapper
│   ├── news/
│   │   └── ArticleCard.tsx        # Article display card
│   ├── ui/                        # Shadcn UI components
│   ├── GravityWrapper.tsx         # Matter.js physics easter egg
│   └── HeroButtons.tsx            # CTA buttons
│
├── middleware.ts                   # Auth guard (Supabase session refresh)
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

---

## 🧬 Database Schema

The platform uses **Supabase PostgreSQL** with the **pgvector** extension for semantic search.

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User data & preferences | `id`, `preference_embedding` (vector 768D) |
| `articles` | News articles & embeddings | `id`, `title`, `content`, `category`, `embedding` (vector 768D) |
| `user_activity` | Reading history tracking | `user_id`, `article_id`, `action_type` |

### Vector Search (RPC)

```sql
-- match_articles: Cosine similarity search
SELECT title, content, category,
       1 - (embedding <=> query_embedding) AS similarity
FROM articles
WHERE 1 - (embedding <=> query_embedding) > match_threshold
ORDER BY similarity DESC
LIMIT match_count;
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with `pgvector` extension enabled
- Google AI Studio API key (free)

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/aieinews.git
cd aieinews
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# Supabase (Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# Google AI (https://aistudio.google.com/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...your-key

# Agent API Security (any random string)
AGENT_SECRET_KEY=your-secret-key
```

### 3. Set Up Database

Enable pgvector in your Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  preference_embedding VECTOR(768),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  article_id UUID REFERENCES articles(id),
  action_type TEXT DEFAULT 'read',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id, a.title, a.content, a.category,
    1 - (a.embedding <=> query_embedding) AS similarity
  FROM articles a
  WHERE 1 - (a.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the platform.

---

## 💡 Use Cases

### 1. Real-Time News Intelligence
> *"Fetch me the latest news on Indian AI startups"*

The AI Agent autonomously searches Economic Times RSS feeds, synthesizes the content, generates vector embeddings, and saves everything to your personal intelligence database.

### 2. Personalized News Feed
> *"What stories match my interests?"*

During onboarding, users select topics of interest. These are converted into a 768-dimensional preference vector using Gemini's `text-embedding-004`. The dashboard then uses **cosine similarity search** to surface the most relevant articles from the database.

### 3. Conversational Analysis
> *"Summarize the market trends from today's articles"*

The RAG pipeline retrieves relevant articles from your database, injects them as context into Gemini, and generates an authoritative financial analysis — like having a personal senior analyst.

### 4. Automated News Pipeline
> `POST /api/agent/ingest` (with `Authorization: Bearer <AGENT_SECRET_KEY>`)

The batch ingestion API can be triggered by cron jobs or webhooks to continuously ingest, synthesize, and vectorize news articles without user interaction.

### 5. Story Arc Tracking
Track evolving narratives across multiple articles — see how stories develop over time with sentiment analysis and event counters.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions, API Routes |
| **AI Engine** | Google Gemini 2.0 Flash | Chat, analysis, tool calling |
| **Embeddings** | text-embedding-004 | 768D vector generation |
| **AI SDK** | Vercel AI SDK v6 | `generateText`, `embed`, `tool`, `stepCountIs` |
| **Database** | Supabase (PostgreSQL + pgvector) | Structured + vector storage |
| **Auth** | Supabase Auth (SSR) | Cookie-based session management |
| **RSS** | rss-parser | Economic Times feed parsing |
| **UI** | Tailwind CSS + Shadcn/UI | Component library |
| **Charts** | Recharts | Analytics visualizations |
| **Physics** | Matter.js | Landing page easter egg |
| **Markdown** | react-markdown | Agent response rendering |

---

## 📊 API Reference

### Server Actions

| Action | File | Description |
|--------|------|-------------|
| `executeAgentInstruction` | `app/actions/agent.ts` | Run the AI Agent with tool calling |
| `updatePersonalizedFeed` | `app/actions/user.ts` | Generate user preference vector |
| `ingestArticle` | `app/actions/news.ts` | Manual article ingestion |
| `logArticleView` | `app/actions/activity.ts` | Track user reading activity |

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/agent/ingest` | Batch news ingestion (requires `AGENT_SECRET_KEY`) |
| `GET` | `/auth/callback` | Supabase OAuth code exchange |

---

## 🔒 Security

- **Row Level Security (RLS)** enabled on all Supabase tables
- **Service Role Key** used only server-side for agent ingestion (bypasses RLS)
- **Cookie-based SSR auth** via `@supabase/ssr` — no tokens exposed to client
- **API route protection** via `AGENT_SECRET_KEY` bearer token
- **Environment validation** via Zod schema on startup
- `.env` files excluded from Git via `.gitignore`

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the AI-powered newsroom of the future.
</p>
