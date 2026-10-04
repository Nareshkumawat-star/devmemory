# DevMemory — the app that remembers your bugs so you don't have to

<!--
  DEV.TO FIELDS (fill in the editor, not in the body):
  • Title:  DevMemory — the app that remembers your bugs so you don't have to
  • Tags (max 4):  #devchallenge  #weekendchallenge  #hf26challenge  #opensource
  • Cover image:   upload a 1000 × 420 image (see "Cover image" note at the bottom)
-->

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

**DevMemory** is a personal coding-memory app. You log the bugs you actually hit — the snippet, the error, and what you learned — and it turns that pile of mistakes into an AI that answers *you*, grounded in *your* history.

I built it for my friend **[Friend's name]**, who is learning to code. His problem was never "I can't find an answer." It was that he kept making *the same class of mistake* over and over — an off-by-one here, a missing null check there, a Python ternary precedence bug he'd already fixed two weeks earlier. He'd fix it, forget it, and then hit a near-identical variant in a different project. Existing tools (Stack Overflow, ChatGPT) give generic answers because they don't know what *he* already got wrong.

DevMemory is the thing that remembers for him. Every mistake he saves makes the next answer sharper.

**Six capabilities:**

- 🧠 **AI root-cause analysis** — paste a snippet + stack trace, and Gemma extracts the real root cause, severity, and the lesson (not just the symptom).
- 🔍 **Semantic search over his own memories** — MongoDB Atlas Vector Search matches by *logic pattern*, not keywords, so "list index out of range" finds his old off-by-one fix.
- 💬 **Grounded Q&A** — ask "why does my recursion blow the stack?" and get an answer built only from bugs he has personally hit.
- ⚠️ **Recurring-bug detection** — every error is tagged and categorized so anti-patterns surface automatically.
- 📊 **Progress analytics** — mistake frequency, severity trends, and a topic-weakness radar over days, weeks, and months.
- 🏋️ **Personalized practice** — generates a fresh coding problem aimed at the exact concepts he struggles with most.

**The pipeline, end to end:**

```
01 Save Memory      → log snippet + problem description + thrown error
02 AI Analysis      → Gemma extracts root cause, difficulty, key takeaways
03 Vector Embed     → chunks + embeddings stored in MongoDB Atlas
04 Semantic Retrieval → Atlas Vector Search pulls relevant past memories
05 Grounded Answer  → Gemma answers, strictly grounded in his own history
```

---

## Demo

> **Deployed app:** [ADD YOUR RENDER URL HERE](https://ADD-YOUR-RENDER-URL-HERE)
> **Video walkthrough:** [ADD YOUR VIDEO LINK HERE](https://ADD-YOUR-VIDEO-LINK-HERE)

> Note: the demo runs on Render's free tier, so the first load after a period of
> inactivity can take ~30–60 seconds to spin up. Give it a moment and it's instant after that.

**Try this path in the demo:**

1. Open **Save Memory** → paste a snippet and an error → watch Gemma break down the root cause.
2. Go to **Analytics** → see the mistake trends update.
3. Go to **Practice** → hit **Generate** → get a problem targeting those exact weaknesses.
4. Go to **Ask** → ask a follow-up question and watch it answer from *your* memories.

---

## Code

**GitHub:** [Nareshkumawat-star/devmemory](https://github.com/Nareshkumawat-star/devmemory)

**Stack**

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Monaco Editor, Recharts |
| Backend | Next.js Route Handlers, Zod validation, Auth.js |
| Database | MongoDB Atlas + Atlas Vector Search |
| AI | **Gemma** (open-weight) for analysis, root-cause detection, practice generation, and Q&A |
| RAG | OpenAI-compatible embedding endpoint + Atlas Vector Search |
| Deploy | Render (free plan) + MongoDB Atlas, with a multi-stage Dockerfile as an alternative |

**Project structure**

```
devmemory/
├── app/
│   ├── dashboard/     # overview pages
│   ├── memories/      # memory CRUD + Monaco editor
│   ├── mistakes/      # mistakes overview
│   ├── practice/      # AI practice generation
│   ├── ask/           # RAG-powered Q&A
│   ├── timeline/      # improvement timeline
│   └── api/           # memories, ai (ask/practice/insights), analytics
├── components/        # ui primitives, dashboard, memory, analytics
├── lib/
│   ├── mongodb.ts     # Atlas connection
│   ├── ai/            # Gemma client + practice/ask
│   ├── embeddings/    # embedding client + chunking
│   ├── rag/           # retrieval pipeline
│   └── validations/   # Zod schemas
└── tests/             # Vitest unit tests + Playwright E2E
```

**API surface**

```
GET/POST      /api/memories
GET/PUT/DELETE /api/memories/[id]
POST          /api/memories/analyze   # Gemma analysis + embed + vector upsert
POST          /api/search             # vector search over memories
GET           /api/analytics/mistakes
POST          /api/ai/ask             # RAG-powered Q&A
POST          /api/ai/practice        # generate a targeted practice problem
GET           /api/ai/insights        # insights from memory history
```

**Quality gates** (all run in CI-style locally):

```bash
npm run typecheck   # tsc --noEmit
npm run test        # 68 Vitest unit tests
npm run test:e2e    # Playwright end-to-end
npm run lint        # ESLint
```

Unit tests cover the pure logic — Zod schemas, embedding chunking + L2 normalization, analytics aggregations, and the formatting utilities. E2E tests drive the real UI: landing page, dashboard, memory editor, ask panel, and API request validation.

---

## How I Built It

**The open-source AI at the center**

DevMemory is built around **Gemma**, an open-weight model from Google. Gemma does the thinking: root-cause analysis of a stack trace, recurring-mistake detection, the personalized explanations, the practice-problem generation, and the grounded Q&A. It talks to my app over a **plain OpenAI-compatible `/chat/completions`** interface, which turned out to be the most important design decision in the whole project.

For retrieval, I use an **OpenAI-compatible embedding endpoint** to chunk and embed each memory, store the vectors in **MongoDB Atlas**, and retrieve them with **Atlas Vector Search**. Gemma then answers strictly from what retrieval returned — so it can't hallucinate advice about code my friend never wrote.

**Architecture**

```
Next.js (UI + route handlers)
      │
      ├── MongoDB Atlas ──────────── Vector Search
      │        ▲                          │
      │        │  embeddings              │ retrieved memories
      │   embedding API                   ▼
      └──────────────► Gemma ──────► grounded answer
```

**How it was actually built (and where the AI agent came in)**

I built this with **Codebuff** as my agent, working through it in small, verifiable steps:

1. Scaffolded the Next.js 16 App Router app, Zod schemas, and MongoDB connection layer.
2. Built the memory CRUD + Monaco editor, then the analyze endpoint (Gemma analysis → embed → vector upsert).
3. Added the RAG pipeline and wired `/api/ai/ask` and `/api/ai/practice` on top of it.
4. Built the analytics dashboard with Recharts and the improvement timeline.
5. Hardened it: 68 unit tests, Playwright E2E, `tsc --noEmit`, ESLint.
6. Deployed to Render on the free plan with a `render.yaml` blueprint + a multi-stage Dockerfile, and pointed Mongo at Atlas.

**Deployment lessons I hit along the way** (in case they help someone else):

- Next.js 16 warns that `next start` is unsupported when `output: "standalone"` is set at build time — so I gate it behind an env flag and only enable it for Docker.
- On Render, setting `NODE_ENV=production` makes `npm ci` skip devDependencies, which breaks the build (Tailwind's PostCSS plugin lives in devDeps). The fix is `npm ci --include=dev && npm run build`.
- `@types/node` had to move to `^24` to satisfy a Vitest 5 peer requirement, and the lockfile had to be regenerated with the same npm major as the build container.

---

## Why Does Open Innovation Matter?

This project **only works because the model is open**. Three concrete reasons:

**1. The inference host is swappable, with zero code changes.** Because DevMemory speaks the plain OpenAI-compatible shape, the exact same code runs against a local Ollama instance, a self-hosted vLLM server, or any hosted provider. That's not a nice-to-have — it's the difference between the app working and not working. During development my friend runs Gemma locally for free and offline; in production it points at a hosted endpoint. One environment variable changes, and the feature set is identical. A closed API locks you to one company's servers, one company's price, and one company's uptime.

**2. Privacy is a feature, not a footnote.** The whole premise is my friend logging *his real mistakes* — the code he's embarrassed about, the bugs from his actual projects. With open weights he can run the entire thing on his own machine and nothing ever leaves it. With a closed API, every personal coding mistake is posted to someone else's server. For a "personal memory" app, that's a fundamental difference.

**3. Open weights let the app stay free.** A hobby project for one friend can't subsidise per-token API costs. Being able to run the open model locally, or point at a free hosted endpoint, is what makes DevMemory viable as a gift rather than a subscription.

More broadly, open innovation is what makes the RAG pattern accessible at all. The embedding pipeline, the vector store, and the model are three independent choices, each replaceable. That composability — being able to hold the whole stack in your head and swap any piece — is exactly what closed, vertically-integrated AI platforms take away.

---

## My Agent Session

I built DevMemory with **[Codebuff](https://codebuff.com) / [Freebuff](https://freebuff.com)** as my coding agent.

> **Agent session:** [ADD YOUR DEVRELAY / AGENT SESSION LINK HERE]
> <!-- Optional: embed with the agent_session tag as per the challenge page. -->

The agent handled the full loop with me: scaffolding the App Router structure, writing the Zod schemas and the MongoDB RAG layer, implementing the Gemma client, building the analytics UI, writing the Vitest + Playwright tests, and debugging the Render deploy (the devDependencies/Tailwind build failure and the `@types/node` peer conflict both surfaced through the agent's test-and-verify cycle).

---

## Prize Categories

<!-- Remove any that don't apply, and add your partner categories. -->

- **Open Source AI** — Gemma (open-weight) as the core reasoning model, with an OpenAI-compatible embedding pipeline and Atlas Vector Search.
- **Best Use of AI in a Developer Tool** — DevMemory is a memory layer for a developer's own mistakes.
- **Best Agent Session / Best Use of Codebuff** — built end to end with Codebuff as the agent.
- **Hacktoberfest Weekend Challenge: Build for a Friend** — built for a friend who keeps repeating the same bugs.

---

<!--
  COVER IMAGE (1000 × 420):
  Use the "🍌 Generate Image" button on dev.to, or grab a dark screenshot of the
  landing hero and crop to 1000:420 (the slate-900 hero with the blue "DevMemory"
  wordmark works well). If generating, try the prompt:
  "dark developer dashboard UI, deep slate background, blue accent, code editor
   on the left, ranked list of past bugs on the right, glowing memory/brain icon,
   flat modern illustration, wide banner"
-->
