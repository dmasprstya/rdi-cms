"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scaleIn, instant } from "@/lib/animations/variants";
import { easings } from "@/lib/animations/easings";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
    children: ReactNode;
    hoverScale?: number;
    delay?: number;
    className?: string;
}

export function AnimatedCard({
    children,
    hoverScale = 1.03,
    delay = 0,
    className
}: AnimatedCardProps) {
    const scrollConfig = useScrollAnimation();
    const prefersReduced = useReducedMotion();

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            {...scrollConfig}
            variants={prefersReduced ? instant : scaleIn}
            whileHover={
                prefersReduced
                    ? undefined
                    : {
                        scale: hoverScale,
                        transition: easings.spring
                    }
            }
            transition={{ delay }}
            className={cn(className)}
        >
            {children}
        </m.div>
    );
}
