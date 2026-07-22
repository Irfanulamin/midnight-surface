import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  // Figma reads "Success Stores" — treating that as a typo for "Stories".
  { label: "Success Stories", href: "/success-stories" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-6 z-50 px-6">
      <nav className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between rounded-pill bg-white px-3 pl-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Midnight Surface"
            width={700}
            height={319}
            priority
            className="h-[52px] w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[15px] text-ink/80 transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="rounded-pill bg-yellow px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-yellow-strong"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
