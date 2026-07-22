"use client";

import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/ssr";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * In-page anchors, not routes — this is a one-page site and those routes do not
 * exist. Rendered as plain <a>, deliberately: next/link intercepts the click and
 * runs its own scroll restoration for a same-page hash, which fights Lenis and
 * produces a jump followed by a smooth correction. A bare anchor lets Lenis own
 * the scroll (see `anchors` in <SmoothScroll>).
 */
const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Our Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  // Figma reads "Success Stores" — treating that as a typo for "Stories".
  { label: "Success Stories", href: "#success-stories" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  /*
   * useScroll + a motion-value listener rather than a scroll event handler.
   * A raw listener fires every frame with no batching and is explicitly banned
   * by the taste skill; state here only flips when a threshold is crossed.
   *
   * Direction-aware: the bar gets out of the way while you read down the page
   * and comes back the moment you reverse, so navigation is always one small
   * gesture away without permanently costing 56px of viewport.
   */
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = lastY.current;
    lastY.current = y;

    setCondensed((prev) => (y > 40 === prev ? prev : y > 40));

    // Always present at the top, where there is nothing to get out of the way of.
    if (y < 80) {
      setHidden(false);
      return;
    }

    /*
     * Lenis keeps emitting sub-pixel changes as its easing settles, and those
     * can carry the opposite sign to the gesture. Ignoring small deltas is what
     * stops the bar flickering at the end of every scroll.
     */
    const delta = y - previous;
    if (Math.abs(delta) < 4) return;

    const next = delta > 0;
    setHidden((prev) => (prev === next ? prev : next));
    // A menu left open while the bar slides away would be orphaned on screen.
    if (next) setMenuOpen(false);
  });

  // The panel overlays the page rather than trapping focus, so Escape is the
  // expected way out and costs one listener.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-4 z-50 px-4 sm:top-6 sm:px-6">
      <motion.nav
        // Drops in on load rather than just being there, then the same y is
        // reused to park it off screen while scrolling down.
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? "-160%" : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: hidden ? 0.35 : 0.5, ease: EASE }}
        className={`mx-auto flex h-14 w-full max-w-[1160px] items-center justify-between rounded-pill pl-4 pr-2 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-16 sm:pl-6 sm:pr-3 ${
          condensed
            ? // Frosted once you leave the top of the page. Height and logo stay
              // put — resizing them mid-scroll made the mark visibly breathe.
              "bg-white/70 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-20px_rgb(0_0_0/0.28)] backdrop-blur-xl"
            : "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]"
        }`}
      >
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Midnight Surface"
            width={700}
            height={319}
            priority
            className="h-[38px] w-auto sm:h-[46px] md:h-[52px]"
          />
        </Link>

        {/*
          lg, not md: at 768 the five links plus the logo and the CTA do not
          fit on one line — they wrapped to two rows and ran straight through
          the wordmark. Tablets get the menu button.
        */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative block py-1 text-[15px] text-ink/80 transition-colors duration-300 hover:text-ink"
              >
                {link.label}
                {/*
                  Underline grows from the left on hover. scaleX rather than
                  width so it stays on the compositor.
                */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/contact"
            className="rounded-pill bg-yellow px-4 py-2.5 text-[13px] font-semibold text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-yellow-strong hover:shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)] active:scale-[0.97] sm:px-6 sm:py-3 sm:text-[15px]"
          >
            Get Started
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-pill text-ink transition-colors duration-300 hover:bg-ink/5 lg:hidden"
          >
            {/*
              Both glyphs render and cross-fade, matching how the service rows
              and FAQ carets swap — one rotating glyph would read as a different
              gesture from the rest of the page.
            */}
            <span className="relative block size-6">
              <List
                size={24}
                aria-hidden
                className={`absolute inset-0 transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <X
                size={24}
                aria-hidden
                className={`absolute inset-0 transition-opacity duration-200 ${
                  menuOpen ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </motion.nav>

      {/*
       * Unmounted when closed rather than hidden, so its links stay out of the
       * tab order without needing inert. There is no measured height here — it
       * animates opacity and transform only — so this avoids the class of
       * AnimatePresence bug the accordion ran into.
       */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mx-auto mt-2 w-full max-w-[1160px] rounded-card bg-white p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_50px_-24px_rgb(0_0_0/0.3)] lg:hidden"
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-[16px] text-ink/85 transition-colors duration-200 hover:bg-cream hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
