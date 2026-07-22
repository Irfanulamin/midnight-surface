# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

```bash
pnpm dev                 # Next.js dev server (default port 3000)
pnpm build               # production build
pnpm start               # serve the production build
pnpm lint                # eslint (flat config, eslint-config-next core-web-vitals + typescript)
pnpm exec tsc --noEmit   # typecheck — the fastest correctness gate; run this after edits
```

There is no test framework in this repo. `tsc --noEmit` plus a visual check in the browser is the verification loop.

## What this is

A single-page marketing site for "Midnight Surface", built as a **pixel-faithful implementation of a Figma design** (`Frame 1`, a 1440 × 18113 export). Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript strict.

`app/page.tsx` composes the whole page from one section component each, in scroll order: `SiteHeader → Hero → TrustedBy → Services → WhyUs → OurWork → Process → Pricing → Testimonials → Faq → CtaBanner`. There is no routing beyond `/` — nav and CTA links point at routes (`/contact`, `/work`, …) that do not exist yet.

**The Figma is the source of truth.** Colours in `app/globals.css`, type sizes, line heights, and container widths were sampled/measured off the export, not eyeballed, and the inline comments record the measurement. When changing a value that has such a comment, re-measure rather than nudging it by feel. Copy that reads as placeholder (`Lorem Ipsum`, the five identical FAQ rows) is verbatim from the design and deliberate — see the comment in `components/faq.tsx`.

## Architecture

### Styling: Tailwind v4, tokens only in `@theme`

`app/globals.css` is the entire design system. It holds the `@theme` token block (`--color-teal`, `--color-cream`, `--color-ink`, `--radius-card`, `--radius-pill`, …) plus three global utilities: `.marquee-track`, `.lift`, `.bg-dotgrid`. There is no `tailwind.config` file — v4 config lives in the CSS.

Two constraints that are easy to break:
- The font family is applied in a plain `html { }` rule, **not** inside `@theme`. `next/font/local` emits a hashed family name into `--font-inter-display` at runtime, and `@theme` is resolved at parse time, so referencing it there silently fails.
- `app/layout.tsx` declares only the five Inter Display weights actually used (400, 400 italic, 500, 600, 700). Using a new `font-*` utility means adding the matching `.ttf` to `app/fonts/` and declaring it there first, or the browser synthesises the weight.

`.lift` is the shared hover physics — `cubic-bezier(0.16, 1, 0.3, 1)`, transform + box-shadow only. Reuse it instead of writing per-component hover transitions so the page decelerates as one system.

### Motion: Motion for entry, GSAP only for pin/scrub

The split is deliberate and documented in the primitives:
- **`components/ui/reveal.tsx`** (Motion / `whileInView`) — `Reveal`, `RevealGroup` + `RevealItem` (variant-driven stagger; children read the parent's variants so inserting a card cannot desync the sequence), and `CurtainReveal` (a brand-colour panel that collapses via `scaleY` from a top origin).
- **`components/ui/horizontal-pan.tsx`** (GSAP + ScrollTrigger) — the only place GSAP is used, because it needs real pinning and scrubbing. `start: "top top"` and `end: "+=<track distance>"` are load-bearing; so is the `ScrollTrigger.refresh()` after images settle.
- **`components/ui/marquee.tsx`** — pure CSS, ships no JS. Item spacing must stay `padding-right` on each item, never flex `gap`, or the `-50%` loop seam jumps.

Every animated primitive checks `useReducedMotion()` (or a `prefers-reduced-motion` media query in CSS) and degrades to static. Keep that when adding motion.

Animate transform and opacity only. For scroll position use `useScroll` + `useMotionValueEvent` (as `site-header.tsx` does), not a raw `scroll` listener.

### Server vs client components

Default is Server Component. Only five files are `"use client"`: `growth-chart`, `site-header`, `ui/accordion`, `ui/horizontal-pan`, `ui/reveal`. Section components stay server-side and import client primitives — keep it that way.

Icons come from `@phosphor-icons/react/ssr` (the `/ssr` entrypoint), which is what lets server sections render icons without a client boundary. Import from `/ssr` in server components.

### Shared components

- `components/section-label.tsx` — `SectionLabel` (the pill eyebrow, `teal` / `onTeal` tones) and `SectionHeading` (the measured `h2` clamp). Use these rather than restating the type ramp.
- `components/ui/accordion.tsx` — headless single-open accordion owning state, ARIA and height animation; styling is entirely the caller's (used by both `faq.tsx` on cream cards and `services.tsx` on teal rows, which look nothing alike).
- Sections converge on `px-6 py-28` with an inner `mx-auto max-w-[1160px]`.
- `components/growth-chart.tsx` — hand-built SVG with a scripted beat order (frame in → curve draws → marker arrives → green fill rises). The green wash is gated behind arrival on purpose; do not make it fill progressively.

### Assets

`public/design/*` are exports from the Figma frame. `public/logo.png` is the mark. `components.json` (shadcn, `radix-nova`, lucide) exists from scaffolding, but **no shadcn component has been installed and there is no `lib/utils.ts`** — the `@/lib/*` and icon aliases in it are aspirational. Everything under `components/ui/` is hand-written.

## Gotchas

- Several component files carry a UTF-8 BOM and contain typographic characters (em dashes, `—`). Edits have previously mojibaked these on Windows; if a dash renders as `â€”`, that is an encoding regression, not intended copy.
- `@/*` maps to the repo root, so imports read `@/components/...`.
- The repo vendors design skills under `.claude/skills/` and `.agents/skills/` (pinned in `skills-lock.json`). The visual work in this repo was produced under `design-taste-frontend`; its rules — no raw scroll listeners, no layout-triggering animation, no default AI-gradient aesthetic — are what the code comments refer to as "the taste skill".
