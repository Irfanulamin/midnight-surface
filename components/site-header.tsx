"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  // Figma reads "Success Stores" — treating that as a typo for "Stories".
  { label: "Success Stories", href: "/success-stories" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();

  /*
   * useScroll + a motion-value listener rather than a scroll event handler.
   * A raw listener fires every frame with no batching and is explicitly banned
   * by the taste skill; state here only flips when the threshold is crossed.
   */
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 40;
    setCondensed((prev) => (prev === next ? prev : next));
  });

  return (
    <header className="sticky top-6 z-50 px-6">
      <motion.nav
        // Drops in on load rather than just being there.
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className={`mx-auto flex w-full max-w-[1160px] items-center justify-between rounded-pill pl-6 pr-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          condensed
            ? // Frosted and tighter once you leave the top of the page.
              "h-14 bg-white/70 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-20px_rgb(0_0_0/0.28)] backdrop-blur-xl"
            : "h-16 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]"
        }`}
      >
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Midnight Surface"
            width={700}
            height={319}
            priority
            className={`w-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              condensed ? "h-[42px]" : "h-[52px]"
            }`}
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
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
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="rounded-pill bg-yellow px-6 py-3 text-[15px] font-semibold text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-yellow-strong hover:shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)] active:scale-[0.97]"
        >
          Get Started
        </Link>
      </motion.nav>
    </header>
  );
}
