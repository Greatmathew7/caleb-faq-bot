# The Registry — Caleb University Student FAQ Chatbot

AI-powered FAQ chatbot for Caleb University students. React (Vite) frontend +
a Netlify serverless function that calls Google's Gemini API, so your API key
never touches the browser. Gemini has a genuine no-card free tier, so this
costs $0 to run as a demo.

## What's inside
- `src/` — React chat UI (registry/ledger design, category tags as "course codes")
- `netlify/functions/chat.js` — serverless function: holds the FAQ knowledge base,
  calls OpenAI, returns the answer
- `src/faqCategories.js` — sidebar categories + quick-tap example questions

## 1. Install
```bash
npm install
```

## 2. Get a free Gemini API key
1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account — no card needed
3. Click "Create API key", copy it

## 3. Run locally
You need the Netlify CLI to run the serverless function locally alongside Vite:
```bash
npm install -g netlify-cli
cp .env.example .env   # then paste your real GEMINI_API_KEY into .env
netlify dev
```
This serves the app (usually on `http://localhost:8888`) with the function
working at `/.netlify/functions/chat`.

> If you just run `npm run dev` (plain Vite, no Netlify CLI), the chat will
> load but API calls will fail — `netlify dev` is what wires up the function.

## 4. Deploy to Netlify
1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
   Build command and publish dir are already set in `netlify.toml`, so you can
   leave the defaults.
3. Go to **Site settings → Environment variables** and add:
   - `GEMINI_API_KEY` = your real Gemini key
4. Deploy. Done — the function is live at `/.netlify/functions/chat`.

(No GitHub repo yet? `netlify deploy --prod` from this folder also works if
you've run `netlify init` first.)

## 5. Make the answers actually accurate
Open `netlify/functions/chat.js` and edit the `FAQ_KNOWLEDGE` block at the top.
Anything marked `[VERIFY]` is a fee, deadline, or threshold that changes by
session — replace those with the real current figures from the Caleb
University admissions/registry portal before you show this to real students.
The model is told to defer to "check the official portal" for anything it's
not sure about, so it won't invent numbers, but accurate source data will
always give better answers than a careful disclaimer.

## 6. Customize
- Sidebar quick-prompts: `src/faqCategories.js`
- Colors/fonts/layout: `src/App.css` (tokens at the top of the file)
- Swap to a different model/provider: change the `model` field and the
  `fetch` URL/headers in `netlify/functions/chat.js` (e.g. OpenAI's
  `/v1/chat/completions` endpoint instead of Gemini's `generateContent`)

## Cost note
Gemini's free tier (no card required) covers this comfortably for a demo —
roughly 10-15 requests/minute and a few hundred per day, far more than a
presentation needs. If you ever outgrow it, Gemini's paid tier and OpenAI's
`gpt-4o-mini` are both cheap (fractions of a cent per message).
