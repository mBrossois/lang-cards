# Lang Cards

A mobile-first flashcard app for language learning, built with React, Vite, and Tailwind CSS. Cards are stored locally in the browser — no account or server needed.

## Features

- **Daily Words** — review cards scheduled for today (including overdue cards)
- **Random Words** — practice a random selection of 40 cards from your full deck
- **Spaced repetition** — after each card, rate your recall; the next review date is set automatically (1, 3, 7, or 14 days out)
- **Add cards manually** — type an original word and its translation
- **Camera capture** — photograph a word list and extract cards automatically via Llama 4 Scout on Groq
- **Upcoming words chart** — homepage bar chart showing how many cards are due each day for the next 6 days
- **Search & edit** — filter, edit, or delete any saved card from the Add screen
- **PWA** — installable as a home screen app

## Getting started

```bash
npm install
npm run dev
```

## Settings

A Groq API key is required for camera-based card extraction. Add it under **Settings** in the app. It is stored obfuscated in `localStorage` and sent only to Groq.

## Tech stack

- React 19, React Router 7
- Tailwind CSS v4
- Vite 8 + vite-plugin-pwa
- @tanstack/react-virtual (card list virtualisation)
- Lucide React (icons)
- @anthropic-ai/sdk, @google/genai, Groq (card extraction)
