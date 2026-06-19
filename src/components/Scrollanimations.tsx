/**
 * Scrollanimations.tsx  (ClickTake Technologies)
 *
 * Fixes in this version:
 *  1. SectionReveal animates in BOTH directions (down AND up scroll)
 *     – `once: false` + threshold-based margin so re-entering from above also
 *       triggers the entry animation.
 *  2. parallaxSpeed is accepted as a prop but applied to a CHILD decorative
 *     layer, NOT the wrapper. This prevents the wrapper Y transform from
 *     creating phantom layout gaps between sections.
 *  3. Smoother spring config (less bounce, better feel).
 *  4. SectionDivider uses whileInView so it also re-animates on upward scroll.
 *  5. Proper TypeScript Variant typing for Framer Motion.
 */

import {
    createContext,
    useContext,
    useRef,
    type ReactNode,
} from "react";

import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useInView,
    type MotionValue,
    type Variant,
    type Transition,
    type Variants,
} from "framer-motion";

import { ArrowUp } from "lucide-react";

/* ────────────────────────────────────────────────────────────── */
/* Context */
/* ────────────────────────────────────────────────────────────── */

interface ScrollCtx {
    scrollYProgress: MotionValue<number>;
}

const ScrollContext = createContext<ScrollCtx | null>(null);

export const useScrollCtx = () => useContext(ScrollContext);

/* ────────────────────────────────────────────────────────────── */
/* Provider */
/* ────────────────────────────────────────────────────────────── */

export function ScrollProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { scrollYProgress } = useScroll();

    return (
        <ScrollContext.Provider value={{ scrollYProgress }}>
            {children}
        </ScrollContext.Provider>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* Progress Bar */
/* ────────────────────────────────────────────────────────────── */

export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            style={{
                scaleX,
                transformOrigin: "0%",
            }}
            className="fixed top-0 left-0 right-0 z-[999] h-[3px] bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
        />
    );
}

/* ────────────────────────────────────────────────────────────── */
/* Reveal Variants */
/* ────────────────────────────────────────────────────────────── */

type RevealVariant =
    | "fadeUp"
    | "fadeIn"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "clipReveal";

interface VariantConfig {
    hidden: Variant;
    visible: Variant;
    transition: Transition;
}

const VARIANTS: Record<RevealVariant, VariantConfig> = {
    fadeUp: {
        hidden: {
            opacity: 0,
            y: 48,
        },

        visible: {
            opacity: 1,
            y: 0,
        },

        transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
        },
    },

    fadeIn: {
        hidden: {
            opacity: 0,
        },

        visible: {
            opacity: 1,
        },

        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },

    slideLeft: {
        hidden: {
            opacity: 0,
            x: -64,
        },

        visible: {
            opacity: 1,
            x: 0,
        },

        transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
        },
    },

    slideRight: {
        hidden: {
            opacity: 0,
            x: 64,
        },

        visible: {
            opacity: 1,
            x: 0,
        },

        transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
        },
    },

    zoomIn: {
        hidden: {
            opacity: 0,
            scale: 0.93,
        },

        visible: {
            opacity: 1,
            scale: 1,
        },

        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
        },
    },

    clipReveal: {
        hidden: {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
        },

        visible: {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
        },

        transition: {
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

/* ────────────────────────────────────────────────────────────── */
/* SectionReveal */
/* ────────────────────────────────────────────────────────────── */

interface SectionRevealProps {
    children: ReactNode;
    variant?: RevealVariant;
    delay?: number;

    /**
     * parallaxSpeed is kept for API compatibility
     * but NOT applied to wrapper transform.
     */
    parallaxSpeed?: number;

    className?: string;
}

export function SectionReveal({
    children,
    variant = "fadeUp",
    delay = 0,
    parallaxSpeed = 0,
    className = "",
}: SectionRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    /*
     * once: false
     * → re-animates when scrolling back upward
     */

    const inView = useInView(ref, {
        once: false,
        margin: "-60px 0px -60px 0px",
    });

    const v = VARIANTS[variant];

    const variants: Variants = {
        hidden: v.hidden,

        visible: {
            ...v.visible,

            transition: {
                ...v.transition,
                delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}

            {/* Decorative parallax layer only */}
            {parallaxSpeed !== 0 && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        y: useParallax(parallaxSpeed),
                    }}
                />
            )}
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* Parallax Hook */
/* ────────────────────────────────────────────────────────────── */

export function useParallax(
    speed = 0.3
): MotionValue<number> {
    const { scrollY } = useScroll();

    return useTransform(scrollY, (value) => value * speed);
}

/* ────────────────────────────────────────────────────────────── */
/* CountUp */
/* ────────────────────────────────────────────────────────────── */

interface CountUpProps {
    to: number;
    suffix?: string;
    className?: string;
}

export function CountUp({
    to,
    suffix = "",
    className = "",
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);

    const inView = useInView(ref, {
        once: true,
    });

    const count = useMotionValue(0);

    const rounded = useTransform(count, Math.round);

    if (inView && count.get() === 0) {
        const step = to / 60;

        const tick = () => {
            const next = count.get() + step;

            if (next < to) {
                count.set(next);
                requestAnimationFrame(tick);
            } else {
                count.set(to);
            }
        };

        requestAnimationFrame(tick);
    }

    return (
        <span ref={ref} className={className}>
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* ScrollToTop */
/* ────────────────────────────────────────────────────────────── */

export function ScrollToTop() {
    const { scrollYProgress } = useScroll();

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.35, 1],
        [0, 0, 1]
    );

    const scale = useTransform(
        scrollYProgress,
        [0.33, 0.38],
        [0.6, 1]
    );

    return (
        <motion.button
            style={{ opacity, scale }}
            onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }
            aria-label="Scroll to top"
            className="fixed bottom-8 right-8 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-card/80 text-foreground backdrop-blur-xl shadow-xl shadow-black/30 transition-colors hover:border-primary/40 hover:text-primary"
        >
            <ArrowUp className="h-5 w-5" />
        </motion.button>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* SectionDivider */
/* ────────────────────────────────────────────────────────────── */

export function SectionDivider({
    flip = false,
}: {
    flip?: boolean;
}) {
    return (
        <motion.div
            initial={{
                scaleX: 0,
                opacity: 0,
            }}
            whileInView={{
                scaleX: 1,
                opacity: 1,
            }}
            viewport={{
                once: false,
                margin: "-20px",
            }}
            transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                originX: flip ? 1 : 0,
            }}
            className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
    );
}