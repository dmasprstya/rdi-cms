"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeIn, fadeInUp, staggerContainer, instant } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: ReactNode;
    variant?: "fadeIn" | "fadeInUp" | "stagger";
    delay?: number;
    className?: string;
}

export function AnimatedSection({
    children,
    variant = "fadeInUp",
    delay = 0,
    className
}: AnimatedSectionProps) {
    const scrollConfig = useScrollAnimation();
    const prefersReduced = useReducedMotion();

    const variantMap = {
        fadeIn: prefersReduced ? instant : fadeIn,
        fadeInUp: prefersReduced ? instant : fadeInUp,
        stagger: prefersReduced ? instant : staggerContainer,
    };

    const selectedVariant = variantMap[variant];

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            {...scrollConfig}
            variants={selectedVariant}
            transition={{ delay }}
            className={cn(className)}
        >
            {children}
        </m.div>
    );
}
