# ichaka.com.ng portfolio and blog

High-performance, mobile-first portfolio and blog for Ikueze Excel Ikenna (ichaka), built with Next.js App Router, Tailwind CSS, Framer Motion, and Sanity CMS.

## Stack

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Sanity (headless CMS)

## Routes

- /
- /about
- /skills/content
- /skills/development
- /blog
- /contact

## Local development

1. Install dependencies:
   npm install
2. Start app:
   npm run dev

## Sanity setup (/studio)

Run this from project root:

npx create-sanity@latest --output-path studio --typescript --template clean

During setup:
- Choose or create a Sanity project
- Use dataset: production
- Keep Studio path: studio

Then add environment values to .env.local from .env.example.

## Notes

- Dark mode is default and uses class-based theming.
- Blog page reads from Sanity when env variables are present.
- If Sanity env vars are missing, /blog shows a setup notice.
