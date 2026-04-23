# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test or lint scripts are configured.

## Environment Variables

Copy `.env.example` to `.env` for local development:
- `RESEND_API_KEY` — Resend email service API key
- `TO_EMAIL` — Contact form recipient address

## Architecture

**Astro + React hybrid**: Astro handles all static rendering; React is used only for `ContactForm.tsx` (mounted with `client:load`). All other components are `.astro` files.

**Deployment**: Static output (`output: 'static'`) deployed on Vercel. The contact form at `src/pages/api/contact.ts` is a serverless API route (POST) using Resend.

**Styling**: TailwindCSS v4 via Vite plugin. Global design tokens live in `src/styles/global.css` — dark theme is the default, light mode toggled via `data-theme="light"` on `<html>` and persisted in `localStorage`. Font is JetBrains Mono throughout.

**Path alias**: `@/*` maps to `src/*`.

## Design System

Terminal/tmux aesthetic — everything is monospace, dark-first, structured as "panes":

- **`Pane.astro`** — core layout primitive; wraps all content sections with a labeled header bar. Use the `noPad` prop for full-width content inside.
- **`WindowChrome.astro`** — sticky header that renders traffic lights, an animated prompt, and nav tabs.
- **`StatusBar.astro`** — sticky footer with live clock.

CSS custom properties (defined in `global.css`) drive all colors: `--bg`, `--surface`, `--fg`, `--accent` (emerald), `--keyword` (purple), `--string` (lime), `--number` (orange), `--comment` (gray).

## Key Pages & Components

- `src/pages/index.astro` — entire homepage; hero, stack marquee, projects, experience, and contact all inline or imported here
- `src/pages/blog/index.astro` + `[slug].astro` — blog list and post pages (no posts currently exist)
- `src/pages/api/contact.ts` — contact form backend
- `src/components/TechStack.astro` — dual-row infinite marquee; skill icons live in `src/assets/skills/`
- `src/content.config.ts` — blog collection schema (title, description, pubDate, tags, draft)

## Workflow

After completing any task, always provide a suggested commit message summarizing all changes made, then ask the user if they want to commit. If they confirm, run `git add` on the relevant files and `git commit` with the suggested message.

If the user declines, keep a running mental list of all changes made so far in the session. When the user eventually wants to commit, consolidate everything into a single commit message covering all accumulated changes.

## SVG Icons

Skill icons in `src/assets/skills/` are imported as Astro `ImageMetadata` by default. **Exception**: `aws.svg` is imported with `?raw` (raw string) so `currentColor` fills inherit the theme text color. New icons with theme-aware colors need the same `?raw` treatment and inline `set:html`.
