# Cyber Month 2026

The merged Cyber Month website combines the event-management app with the Cyber Month landing page, timeline and about page.

## Getting started

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main pages

- `/` — Cyber Month landing page
- `/events` — published events
- `/timeline` — Cyber Month timeline
- `/about` — about BMSCE IEEE Computer Society
- `/admin` — event administration

## Environment

The database-backed event and admin pages require `DATABASE_URL`. Event image uploads use the ImageKit settings `IMAGE_KIT_PUBLIC_KEY`, `IMAGE_KIT_PRIVATE_KIT`, and `IMAGE_KIT_ENDPOINT`. Configure these in a local `.env` file before using those pages.

## Available commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```
