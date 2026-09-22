# Parteli website

Complete source for the Parteli powersports website, including its graphics, styling, responsive layouts, scroll reveals, and automatic vehicle-to-workflow animations.

## Start here

1. Extract this ZIP. The `parteli-website` folder is the project root.
2. Install **Node.js 24 LTS**, which includes npm: https://nodejs.org/
3. Open a terminal in `parteli-website` (the folder containing `package.json`).
4. Run:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal. Keep the terminal running while viewing the website. Press Ctrl+C to stop it.

These commands are intended for Windows PowerShell, macOS, and Linux. Internet access is required for the first dependency installation. The ZIP includes the dependency lockfile; do not replace `npm ci` with dependency upgrades if you want to preserve the exported versions.

## Put this project on GitHub

**Extract the ZIP first. Uploading the ZIP itself only stores an archive; it does not create a usable source repository.**

The simplest method for the whole project is GitHub Desktop:

1. Install GitHub Desktop from https://desktop.github.com/ and sign in.
2. Choose **File → New repository**. Give it a name such as `parteli-website` and choose a location outside this extracted folder.
3. Open the newly created repository folder in your file manager.
4. Copy **all contents** of the extracted `parteli-website` folder into that repository folder, including folders/files beginning with a dot (`.openai`, `.npmrc`, `.gitignore`, `.nvmrc`). Enable viewing hidden files if necessary. Keep the `.git` directory created by GitHub Desktop.
5. Confirm `package.json`, `README.md`, `app`, and `public` are directly in the repository root, not inside another nested `parteli-website` folder.
6. In GitHub Desktop, review Changes, enter a summary such as `Add Parteli website`, and commit.
7. Click **Publish repository**, choose visibility, and publish.

Do not copy generated folders such as `node_modules`, `dist`, `.wrangler`, or `.sites-runtime` if you have already run the project. They are ignored by the included `.gitignore`.

GitHub also supports browser uploads, but its upload limits make Desktop more convenient for this project. Preserve all dotfiles and the folder structure whichever method you choose.

Official instructions:
- https://docs.github.com/en/desktop/adding-and-cloning-repositories/creating-your-first-repository-using-github-desktop
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Hosting: what GitHub does and does not do

Publishing the repository stores the source on GitHub. It does **not** automatically put the website online.

This project uses React, Vinext/Vite, and a Cloudflare Worker entry point. It is **not a static GitHub Pages export**. GitHub Pages cannot run this package unchanged. A compatible host must be configured before a new public deployment will work; account credentials and domain settings are not transferable inside a ZIP.

The existing published website remains separate from this export. Uploading this project to GitHub does not update that website or connect automatic deployments.

For local production testing:

```sh
npm run build
npm run start
```

Use the URL printed by the start command. For an independent public deployment, configure Cloudflare Workers/Vinext for your own account and domain. No deployment credentials are included. The `.openai/hosting.json` file is retained because the build imports it; its project ID refers to the original Sites project and is not a hosting credential.

## Included behavior

- Light Parteli branding and local image assets.
- Motorcycle assembly/entrance followed automatically by departure.
- Work-order reveal, customer message typing/sending, and synchronization.
- Off-road vehicles, boats, personal watercraft/jet skis, and a snowmobile.
- Seasonal content, overlapping scroll chapters, and mobile layouts.

Scrolling activates the chapter. Once activated and visible, its timed sequence advances without further scrolling. Chapters replay on a fresh visit after leaving view; a completed chapter does not loop while you are reading it. There is no motion on/off button.

The work orders, messages, and synchronization are visual demonstrations. They do not send actual customer messages or connect to a live shop database. Original unused image assets, including the earlier RV image, remain in the asset folder for completeness; that does not add an RV to the current page.

## Useful files

| File/folder | Purpose |
| --- | --- |
| `app/page.tsx` | Main website sections and content |
| `app/story-scene.tsx` | Vehicle and workflow visuals |
| `app/story-motion.ts` | Automatic sequence timing and state |
| `app/story.css`, `app/globals.css` | Layout and animation styling |
| `public/brand` | Parteli logo assets |
| `public/images` | Vehicle and background images |
| `package.json`, `package-lock.json` | Commands and pinned dependency tree |
| `vite.config.ts`, `worker/index.ts` | Build and server configuration |

## Checks

```sh
npm run test:motion
npm run build
```

The motion tests cover vehicle visibility, transitions, typing/sending, and time-driven progression without scroll input. The inherited starter tests are also included; `npm test` runs the build and all tests.

## Export notes

Source snapshot: `9dfb453601f356557c4bc4b5060548ab09f972c9`.

The website implementation and assets are unchanged from that snapshot. Export-only changes: this guide replaces the starter README; package commands use direct tools instead of Linux-specific Bash wrappers; `test:motion` and a Node 24 `.nvmrc` are added; generated TypeScript cache files are ignored. Original helper scripts remain available under `scripts/`.

No git history, installed dependencies, build outputs, local caches, or secret environment files are included. Dependencies are restored with `npm ci`. Validation details are recorded in `EXPORT-CHECKS.txt`.
