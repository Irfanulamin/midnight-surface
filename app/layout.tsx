import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/*
 * Inter Display, self-hosted from app/fonts.
 *
 * These are the static instances, not the variable font — so there is no opsz
 * axis to drive. Each weight is a discrete file, and only the five the codebase
 * actually uses are declared (400, 400 italic, 500, 600, 700). Adding a new
 * font-weight utility means adding the matching file here first, otherwise the
 * browser will synthesise it and the type will look subtly wrong.
 */
const interDisplay = localFont({
  src: [
    { path: "./fonts/InterDisplay-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InterDisplay-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/InterDisplay-Medium.ttf", weight: "500", style: "normal" },
    {
      path: "./fonts/InterDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    { path: "./fonts/InterDisplay-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midnight Surface — Everything Your Business Needs in One Website",
  description:
    "Professional websites for small businesses—designed, developed, launched, and supported without breaking your bank.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
