import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/*
 * shadcn button, rebuilt on this project's tokens.
 *
 * The generated version was written entirely against shadcn's CSS variables —
 * bg-primary, text-primary-foreground, border-ring, --radius-md — and this
 * project never ran shadcn's init, so `globals.css` is hand-built and defines
 * none of them. Shipped as generated it would have rendered as unstyled text.
 * The structure is kept (cva variants, Slot for asChild) because that is the
 * reusable part; every value is the design's.
 *
 * All buttons here are pills, and the shared easing is the same curve the rest
 * of the page decelerates on, so a button feels like the cards it sits among.
 * `active:scale` gives the press its physical beat.
 */
const buttonVariants = cva(
  "group/btn inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** The site's CTA: yellow pill, ink text. */
        primary: "bg-yellow text-ink hover:bg-yellow-strong",
        /** Sits on a photograph or a busy panel, where yellow would shout. */
        surface:
          "bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:-translate-y-0.5",
        /** On the teal panels. */
        onTeal: "bg-white/10 text-white hover:bg-white/20",
      },
      size: {
        sm: "px-4 py-2.5 text-[13px] sm:px-6 sm:py-3 sm:text-[15px]",
        default: "px-6 py-3 text-[14px] sm:px-7 sm:py-3.5 sm:text-[15px]",
        lg: "px-8 py-4 text-[16px]",
        /** Fills its column, as the pricing cards do. */
        block: "w-full px-6 py-3.5 text-[15px] sm:py-4 sm:text-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

/*
 * Label that swaps itself on hover.
 *
 * The word rides up out of a mask while an identical copy arrives from below,
 * so the button answers the pointer with the page's own device — the same mask
 * rise the headings and the Popular badge use — rather than a colour change
 * borrowed from somewhere else.
 *
 * Two copies rather than one moved and reset: a single label would have to
 * jump back to the bottom to repeat, and that reset is visible. With a pair,
 * the exit and the entrance are the same gesture and it can be reversed at any
 * point mid-hover without a seam.
 *
 * No padding on the mask, deliberately. The usual descender fix (pb/-mb, as in
 * TextReveal) would make the mask taller than the copy inside it, and the
 * second label — offset by exactly its own height — would then sit a few px
 * inside the mask instead of just below it, showing as a sliver under the
 * first. The line box already carries descender room at these sizes.
 *
 * Gated on motion-safe: with reduced motion the label simply does not move.
 */
function ButtonLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export { Button, ButtonLabel, buttonVariants };
