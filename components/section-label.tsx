export function SectionLabel({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "teal" | "onTeal";
}) {
  return (
    <span
      className={
        tone === "teal"
          ? "inline-block rounded-pill bg-teal px-5 py-2 text-[13px] uppercase tracking-[0.08em] text-white"
          : "inline-block rounded-pill bg-white/12 px-5 py-2 text-[13px] uppercase tracking-[0.08em] text-white"
      }
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.025em] ${className}`}
    >
      {children}
    </h2>
  );
}
