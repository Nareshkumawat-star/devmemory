# DevMemory

A personal coding memory application that stores your coding mistakes, errors, and lessons, then uses a Retrieval-Augmented Generation (RAG) pipeline to power personalized AI insights, practice recommendations, and analytics.

## Tech Stack

- **Frontend:** Next.js 16+, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Recharts, Monaco Editor, React Markdown
- **Backend:** Next.js App Router, Next.js Route Handlers, TypeScript, Zod, Auth.js
- **Database:** MongoDB Atlas with Vector Search
- **AI:** Gemma (open-weight) for mistake analysis, root-cause detection, memory analysis, recurring mistake detection, personalized explanations, practice generation, and coding-history Q&A
- **Embeddings/RAG:** OpenAI-compatible embedding API with MongoDB Atlas Vector Search

## Architecture: Next.js → MongoDB Atlas → Vector Search → RAG → Gemma → Personalized Coding Memory

1. **Coding Memory** is created via the Monaco Editor (C++, Python, JavaScript, Java, TypeScript)
2. **Text Processing** extracts and chunks the memory into searchable text
3. **Embedding Model** generates vector embeddings for each chunk
4. **MongoDB Atlas** stores the embeddings in a vector search index
5. **Vector Search** retrieves relevant memories for a query
6. **Gemma** generates a personalized answer grounded in those memories
7. **Personalized Answer** is returned to the user, continuously improving as more memories are stored

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

- `MONGODB_URI` — your MongoDB Atlas connection string
- `MONGODB_DB_NAME` — your database name
- `AUTH_SECRET` — Auth.js secret
- `GEMMA_API_URL` — your Gemma endpoint (local, Render, or self-hosted)
- `GEMMA_API_KEY` — your Gemma API key
- `EMBEDDING_API_URL` — OpenAI-compatible embedding endpoint
- `EMBEDDING_API_KEY` — your embedding API key

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
devmemory/
├── app/
│   ├── dashboard/          # Dashboard pages
│   ├── memory/             # Memory CRUD
│   ├── mistakes/           # Mistakes overview
│   ├── practice/           # Practice generation
│   ├── ask/                # AI Q&A
│   ├── timeline/           # Improvement timeline
│   └── api/                # Route handlers
│       ├── memories/       # CRUD + analyze
│       ├── ai/             # ask, practice, insights
│       └── analytics/      # mistake analytics
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Analytics dashboard
│   ├── memory/             # Memory editor, card, viewer
│   └── analytics/          # Recharts wrapper
├── lib/
│   ├── mongodb.ts          # MongoDB connection
│   ├── ai/                 # Gemma, practice, ask
│   ├── embeddings/         # Embedding client
│   ├── rag/                # RAG pipeline
│   └── validations/        # Zod schemas
└── tests/                  # Vitest & Playwright tests
```

## API Endpoints

- `GET /api/memories` — List memories
- `POST /api/memories` — Create memory
- `GET /api/memories/[id]` — Get memory
- `PUT /api/memories/[id]` — Update memory
- `DELETE /api/memories/[id]` — Delete memory
- `POST /api/memories/analyze` — Analyze code errors with Gemma
- `POST /api/search` — Vector search over memories
- `POST /api/memories/analyze` — Gemma analysis + embed + vector upsert
- `GET /api/analytics/mistakes` — Analytics
- `POST /api/ai/ask` — Ask questions (RAG-powered)
- `POST /api/ai/practice` — Generate practice problems
- `GET /api/ai/insights` — Insights from memory history

## Testing

```bash
npm run typecheck       # tsc --noEmit
npm run test            # Run vitest unit tests
npm run test:watch      # Vitest in watch mode
npm run test:e2e        # Run Playwright end-to-end tests
```

Unit tests cover the pure logic — Zod validation schemas, embedding chunking and
L2 normalization, analytics aggregations, and the `cn`/formatting utilities.
E2E tests drive the real UI: landing page, dashboard, memory editor, ask panel,
and API request validation.

The first E2E run downloads a browser:

```bash
npx playwright install chromium
```

## Deployment

- **Vercel** — Next.js frontend + backend
- **MongoDB Atlas** — Database + Vector Search
- **Render** — Optional self-hosted Gemma inference
- **GitHub** — Source control

## Environment Variables

See `.env.example` for all required variables. Never commit API keys or secrets.
