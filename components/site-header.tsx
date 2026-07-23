"use client";

import Image from "next/image";
import Link from "next/link";
import { List } from "@phosphor-icons/react/ssr";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
          <Button asChild size="sm" className="font-semibold hover:-translate-y-0.5">
            <Link href="/contact">Get Started</Link>
          </Button>

          {/*
            Mobile nav is the shadcn Sheet (radix Dialog). Controlled rather than
            trigger-only so the direction-aware scroll logic above can close it
            (`setMenuOpen(false)`) when the bar slides away — a menu left open
            over a hidden bar would be orphaned on screen. Radix owns focus trap,
            Escape and scroll-lock, which is why the old manual handlers are gone.
          */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-pill text-ink transition-colors duration-300 hover:bg-ink/5 focus:outline-none lg:hidden"
            >
              <List size={24} aria-hidden />
            </SheetTrigger>

            <SheetContent side="right" className="w-4/5 max-w-xs gap-0 pt-16">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Mobile">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-4 py-3.5 text-[17px] text-ink/85 transition-colors duration-200 hover:bg-cream hover:text-ink"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <Button asChild size="block" className="mt-6 font-semibold">
                <Link href="/contact" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </header>
  );
}
