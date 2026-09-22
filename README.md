# Parteli website

Source for the Parteli powersports website, including its graphics, styling,
responsive layouts, scroll reveals, and automatic vehicle-to-workflow
animations.

A standard Next.js App Router project. The whole site prerenders to static HTML.

## Start here

Install **Node.js 22.18 or newer** (https://nodejs.org/), then:

```sh
npm install
npm run dev
```

Open the URL printed in the terminal. Ctrl+C stops it.

## Deploying

Push to GitHub and import the repository on Vercel, or run `npx vercel`.
No configuration is needed — Vercel detects Next.js and builds it.

```sh
npm run build   # production build
npm start       # serve the production build locally
```

## Included behavior

- Light Parteli branding and local image assets.
- Motorcycle assembly/entrance followed automatically by departure.
- Work-order reveal, customer message typing/sending, and synchronization.
- Off-road vehicles, boats, personal watercraft/jet skis, and a snowmobile.
- Seasonal content, overlapping scroll chapters, and mobile layouts.

Scrolling activates a chapter. Once activated and visible, its timed sequence
advances without further scrolling. Chapters replay on a fresh visit after
leaving view; a completed chapter does not loop while you are reading it. There
is no motion on/off button.

The work orders, messages, and synchronization are visual demonstrations. They
do not send real customer messages or connect to a live shop database. Unused
image assets, including the RV image, remain in the asset folder; that does not
add an RV to the current page.

## Useful files

| File/folder | Purpose |
| --- | --- |
| `app/page.tsx` | Main website sections and content |
| `app/story-scene.tsx` | Vehicle and workflow visuals |
| `app/story-motion.ts` | Automatic sequence timing and state |
| `app/story.css`, `app/globals.css` | Layout and animation styling |
| `app/layout.tsx` | Root layout and page metadata |
| `public/brand` | Parteli logo assets |
| `public/images` | Vehicle and background images |
| `package.json`, `package-lock.json` | Commands and pinned dependency tree |

## Checks

```sh
npm run test:motion   # 6 tests: visibility, transitions, typing/sending, timing
npm run lint
npm run build
```

`npm run lint` reports warnings about `<img>` versus `next/image`. The site uses
plain `<img>` tags deliberately; the images are pre-sized WebP assets and the
scroll choreography transforms them directly.

## History

This project was originally exported from an OpenAI Sites build targeting
Cloudflare Workers via vinext and Vite. It has since been converted to a plain
Next.js app for Vercel. Removed in that conversion: the Vite and Cloudflare
build pipeline (`vite.config.ts`, `build/`), the Worker entry point (`worker/`),
unused ChatGPT header authentication (`app/chatgpt-auth.ts`), the unused Drizzle
and D1 scaffolding (`db/`, `drizzle/`, `examples/`), the Linux-only sandbox
scripts (`scripts/`), and two starter tests that required the Worker bundle and
a Vite server.

The website implementation and assets are unchanged. `EXPORT-CHECKS.txt`
documents the original Cloudflare export and is kept for reference only; its
commands no longer apply.
