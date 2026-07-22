"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";

/*
 * Single-open accordion primitive.
 *
 * Owns the state, the ARIA wiring and the height animation; styling is left
 * entirely to the caller, because the two places this is used look nothing
 * alike (borderless rows on teal vs. separated cards on cream). Trying to
 * express both through one set of style props would have been worse than
 * passing the visuals in.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type AccordionContextValue = {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  baseId: string;
  reportMetrics: (index: number, triggerHeight: number, panelHeight: number) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("<AccordionItem> must be rendered inside <Accordion>");
  }
  return ctx;
}

export function Accordion({
  children,
  defaultIndex = null,
  className,
  /**
   * Reserve space for the tallest panel so the block never changes height as
   * rows toggle. Off by default; opt in where the layout shift is disruptive.
   */
  fixedHeight = false,
}: {
  children: React.ReactNode;
  /** Index open on first paint. `null` starts fully collapsed. */
  defaultIndex?: number | null;
  className?: string;
  fixedHeight?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultIndex);
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  /*
   * Reserve = sum of the (always-collapsed) trigger rows + the tallest panel.
   *
   * Critically this never reads the root's own height. An earlier version did,
   * and since the reserve is applied AS the root's min-height, every
   * measurement included the value it had just written — the reserve grew on
   * each ResizeObserver tick until the renderer locked up. Deriving it only
   * from children makes the feedback loop structurally impossible.
   */
  const metrics = useRef<Map<number, { trigger: number; panel: number }>>(
    new Map(),
  );
  const [reserve, setReserve] = useState<number | null>(null);

  const reportMetrics = useCallback(
    (index: number, triggerHeight: number, panelHeight: number) => {
      if (!fixedHeight) return;

      const prev = metrics.current.get(index);
      if (prev && prev.trigger === triggerHeight && prev.panel === panelHeight) {
        return;
      }
      metrics.current.set(index, {
        trigger: triggerHeight,
        panel: panelHeight,
      });

      let triggers = 0;
      let tallestPanel = 0;
      for (const m of metrics.current.values()) {
        triggers += m.trigger;
        tallestPanel = Math.max(tallestPanel, m.panel);
      }
      setReserve(Math.ceil(triggers + tallestPanel));
    },
    [fixedHeight],
  );

  return (
    <AccordionContext.Provider
      value={{ openIndex, setOpenIndex, baseId, reportMetrics }}
    >
      <div
        ref={rootRef}
        className={className}
        style={reserve ? { minHeight: reserve } : undefined}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  index,
  trigger,
  children,
  className,
  triggerClassName,
}: {
  index: number;
  /*
   * Plain ReactNode, deliberately not a render prop. These items are used from
   * Server Components, and functions cannot cross the server -> client
   * boundary. Callers style against open state with Tailwind's aria variants
   * instead — the button carries `group` and `aria-expanded`, so children can
   * use `group-aria-expanded:*` and ancestors `has-[[aria-expanded=true]]:*`.
   */
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}) {
  const { openIndex, setOpenIndex, baseId, reportMetrics } = useAccordion();
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLHeadingElement>(null);

  /*
   * The panel animates to a measured pixel height, never to "auto".
   *
   * Motion can animate *to* height:auto, but animating *away from* a literal
   * auto it snapped to via initial={false} fails silently — the row that
   * started open would stay stuck at full height with its trigger already
   * reporting closed. A number has no such edge case.
   *
   * ResizeObserver keeps the number honest when the content reflows (viewport
   * changes, font swap), so the open height is never stale.
   */
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      setContentHeight(h);
      reportMetrics(index, triggerRef.current?.offsetHeight ?? 0, h);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, reportMetrics]);

  const open = openIndex === index;
  const panelId = `${baseId}-panel-${index}`;
  const triggerId = `${baseId}-trigger-${index}`;

  return (
    <div className={className}>
      <h3 ref={triggerRef}>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          // Clicking an open row closes it, so the set can rest fully collapsed.
          onClick={() => setOpenIndex(open ? null : index)}
          className={`group ${triggerClassName ?? ""}`}
        >
          {trigger}
        </button>
      </h3>

      {/*
       * Always mounted, height animated between 0 and auto.
       *
       * This previously used AnimatePresence with a conditional child, and the
       * exit animation intermittently failed to run — leaving a closed panel
       * stuck at height:auto/opacity:1 while its trigger reported
       * aria-expanded="false". Keeping the node mounted removes the entire
       * mount/unmount race; there is no exit to miss.
       *
       * `inert` (React 19) pulls the collapsed content out of the tab order and
       * the accessibility tree, which overflow-hidden alone does not do.
       */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        data-open={open ? "true" : "false"}
        inert={!open}
        initial={false}
        animate={{ height: open ? contentHeight : 0, opacity: open ? 1 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                height: { duration: 0.42, ease: EASE },
                opacity: { duration: 0.28 },
              }
        }
        className="overflow-hidden"
      >
        <div ref={contentRef}>{children}</div>
      </motion.div>
    </div>
  );
}
