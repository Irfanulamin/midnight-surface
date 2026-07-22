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

`pnpm lint` currently reports one pre-existing error — `react-hooks/set-state-in-effect` in `growth-chart.tsx`, where the reduced-motion branch sets state synchronously. Everything else is clean; don't let that one mask a new one.

Note `next lint` was removed in Next 16 — the script is plain `eslint`.

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

### Motion: Lenis for scroll, Motion for entry, GSAP only for pin/scrub

The split is deliberate and documented in each primitive:

- **`components/ui/smooth-scroll.tsx`** (Lenis) — mounted once in `app/layout.tsx`. It eases the real window scroll position, so everything downstream (ScrollTrigger, `useScroll`, `whileInView`) inherits the smoothing without knowing Lenis exists. Three bits of wiring are load-bearing and explained in the file: `autoRaf: false` + `gsap.ticker` (one frame, not two loops), `lenis.on("scroll", ScrollTrigger.update)`, and `lagSmoothing(0)`. Lenis' stylesheet is inlined into `globals.css` — its `height: auto` on html/body is what gives it something to scroll.
- **`components/ui/reveal.tsx`** (Motion / `whileInView`) — `Reveal`, `RevealGroup` + `RevealItem` (variant-driven stagger; children read the parent's variants so inserting a card cannot desync the sequence), and `CurtainReveal` (a brand-colour panel that collapses via `scaleY` from a top origin).
- **`components/ui/text-reveal.tsx`** — `TextReveal` (per-word mask rise; takes a plain **string** so it can split it, and sets `aria-label` so the heading is announced as one phrase) and `MaskReveal` (single mask, for a line containing markup). The `pb-[0.14em] / mb-[-0.14em]` pair on the mask is what stops `overflow-hidden` clipping descenders.
- **`components/ui/horizontal-pan.tsx`** (GSAP + ScrollTrigger) — the only place GSAP is used, because it needs real pinning and scrubbing. Used by both Our Work and How It Works. Set up through `gsap.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")`, so the pin simply does not exist on phones and reverts cleanly on resize. `start: "top top"` and `end: "+=<track distance>"` are load-bearing, as is the `ScrollTrigger.refresh()` after images settle. The section is exactly `100dvh` while pinned, so its `py` is kept tight — every px there is a px the cards do not get. `trailClassName` sets the room after the last card; raise it (How It Works uses `md:pr-[38vw]`) when something has to react to reaching the centre of the screen, because at the default the track stops with the last card at the right edge.
- **`components/process-track.tsx`** — the How It Works steps, with exactly one lit at a time. The highlight is driven by **nearest-to-centre**, measured from `useScroll` + `useMotionValueEvent`, not by an IntersectionObserver band: cards sit on a 380px pitch with a 40px gap, so any band wider than that gap catches two neighbours and any band narrower drops to zero while a gap crosses the middle. The axis flips at `md`, matching the pan.
- **`components/ui/marquee.tsx`** — pure CSS, ships no JS. Item spacing must stay `padding-right` on each item, never flex `gap`, or the `-50%` loop seam jumps.
- **`parallax.tsx`**, **`magnetic.tsx`**, **`scroll-progress.tsx`** — scroll-linked drift, pointer attraction (gated on `(pointer: fine)`), and the top progress rule.

Every animated primitive checks `useReducedMotion()` (or a `prefers-reduced-motion` media query in CSS) and degrades to static. Keep that when adding motion.

Animate transform and opacity only. For scroll position use `useScroll` + `useMotionValueEvent` (as `site-header.tsx` does), not a raw `scroll` listener. `useMediaQuery` (`components/ui/use-media-query.ts`) wraps `matchMedia` in `useSyncExternalStore` — use it rather than reading `matchMedia` into state from an effect, which the `react-hooks/set-state-in-effect` rule rejects.

### Server vs client components

Default is Server Component; section components stay server-side and import client primitives. Keep it that way — the `"use client"` files are the primitives plus `growth-chart` and `site-header`.

Icons come from `@phosphor-icons/react/ssr` (the `/ssr` entrypoint), which is what lets server sections render icons without a client boundary. Import from `/ssr` in server components.

### Shared components

- `components/section-intro.tsx` — the label / heading / body trio that opens nearly every section, and the one place the entrance choreography lives (pill → heading assembling word by word → body catching up). Sections pass only what differs: the measured `max-w`, the colour, `align`. **The body type ramp is set here**, so callers pass width and colour only.
- `components/section-label.tsx` — `SectionLabel` (the pill eyebrow, `teal` / `onTeal`) and `sectionHeadingClass`, exported as a class string rather than a component because `SectionIntro` renders the `h2` through `TextReveal`, which must own the element to split it.
- `components/ui/accordion.tsx` — headless single-open accordion owning state and ARIA; styling is entirely the caller's (used by `faq.tsx` on cream cards and `services.tsx` on teal rows, which look nothing alike). The panel opens by transitioning `grid-template-rows: 0fr → 1fr`, **not** to a measured pixel height — the old measured-height version silently clipped content whose height it had guessed wrong, and `min-h-0` on the inner div is what lets it close. The ResizeObserver now only feeds the optional `fixedHeight` reserve.
- `components/growth-chart.tsx` — hand-built SVG with a scripted beat order (frame in → curve draws → marker arrives → green fill rises). The green wash is gated behind arrival on purpose; do not make it fill progressively. Because the whole thing is one 932-unit viewBox, its type is scaled by `COMPACT_TYPE_SCALE` below `sm` — geometry stays fixed, only the labels grow, and the callout pill is sized from the same factor so the box and its text grow together.

### Responsive

The design was drawn at 1440. Breakpoints in use are Tailwind defaults; two are not obvious:

- **Nav collapses to a menu below `lg`, not `md`.** At 768 the five links plus the wordmark and the CTA do not fit on one line — they wrapped and ran through the logo. Same reason the service panel only puts its tag list beside the paragraph at `lg`.
- **`md` is where the design's desktop layout starts**: the Our Work pin, the 3-column bento (`md:h-[760px]`), and the pricing grid. Below `md` the bento columns stack, and cards whose illustration is absolutely positioned carry an explicit `min-h-*` that is dropped again at `md` — without a fixed column height, `flex-1` has nothing to divide and those cards collapse to their heading.

Sections use `px-6 py-16 sm:py-20 md:py-28` (the design's `py-28` only at `md`). Custom hover CSS in `globals.css` is wrapped in `@media (hover: hover)` so it cannot latch on touch; Tailwind's own `hover:` variant already does this.

### Assets

`public/design/*` are exports from the Figma frame. `public/logo.png` is the mark. `components.json` (shadcn, `radix-nova`, lucide) exists from scaffolding, but **no shadcn component has been installed and there is no `lib/utils.ts`** — the `@/lib/*` and icon aliases in it are aspirational. Everything under `components/ui/` is hand-written.

### In-page navigation

The nav links are hash anchors (`#top`, `#services`, `#work`, `#pricing`, `#success-stories`), rendered as **plain `<a>`, not `next/link`** — Link intercepts a same-page hash and runs its own scroll, which fights Lenis. The click is handled by one delegated listener in `SmoothScroll`; Lenis' own `anchors` option did not intercept, so it is off. Two things there are load-bearing: the target is resolved to a **number** with an explicit duration (handing Lenis the element left it resolving both position and timing from defaults, and it silently did nothing), and `onComplete` re-measures once, because the pinned sections resize the document mid-flight and the position computed at click time can land hundreds of px out. `HEADER_OFFSET` (96) is kept in step with the `scroll-mt-24` on each anchored section, which is the fallback when Lenis is not running.

## Gotchas

- **Tailwind v4 compiles `rotate-*` to the standalone `rotate` property, not `transform`.** `transition-[transform]` will never see it and the element snaps round with no animation. Transition `rotate` (see the service row arrow). Same applies to `translate-*` and `scale-*`.
- **A `whileInView` trigger must not sit on an element its own mask clips.** IntersectionObserver clips the intersection rect against ancestor `overflow`, so a child translated fully outside its mask has zero visible area and can never fire — it cannot animate until it is visible and cannot be visible until it animates. Put the trigger on the mask and drive the child with variants; both `TextReveal` and `MaskReveal` do this.
- Several component files carry a UTF-8 BOM and contain typographic characters (em dashes, `—`). Edits have previously mojibaked these on Windows; if a dash renders as `â€”`, that is an encoding regression, not intended copy.
- `@/*` maps to the repo root, so imports read `@/components/...`.
- The repo vendors design skills under `.claude/skills/` and `.agents/skills/` (pinned in `skills-lock.json`). The visual work in this repo was produced under `design-taste-frontend`; its rules — no raw scroll listeners, no layout-triggering animation, no default AI-gradient aesthetic — are what the code comments refer to as "the taste skill".
