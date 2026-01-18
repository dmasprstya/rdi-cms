"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxBgProps {
    children: ReactNode;
    speed?: number; // 0.5 = half speed, 0 = fixed
    className?: string;
}

export function ParallaxBg({ children, speed = 0.5, className = "" }: ParallaxBgProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Transform scroll to parallax offset
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

    // Disable on mobile or reduced motion
    const shouldAnimate = !prefersReducedMotion && typeof window !== "undefined" && window.innerWidth >= 768;

    return (
        <div ref={ref} className={className}>
            <motion.div
                style={{ y: shouldAnimate ? y : 0 }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
