import Link from "next/link";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/ssr";

export function CtaBanner() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-[1160px] rounded-2xl bg-teal px-14 py-20 text-white">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[19px] text-white/80">
              Are You Still Confused To Work With Us?
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              Build Your Website with
              <br />
              <span className="text-yellow">$0.00</span> Upfront
            </h2>

            <ul className="mt-12 flex flex-wrap items-center gap-8">
              {["Free Draft Design", "No Commitment to Take Service"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle
                      size={20}
                      weight="fill"
                      aria-hidden
                      className="text-yellow"
                    />
                    <span className="text-[15px] text-white/90">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="shrink-0">
            <p className="text-[15px] text-white/70">9.8/10</p>
            <p className="mt-1 text-[19px]">
              Successfully Completed 100+ Project
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-pill bg-yellow px-8 py-4 text-[16px] font-medium text-ink transition-colors hover:bg-yellow-strong"
            >
              Contact Us
              <ArrowUpRight size={18} weight="bold" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
