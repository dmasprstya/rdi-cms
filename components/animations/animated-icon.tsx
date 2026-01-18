"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bounceIn, instant } from "@/lib/animations/variants";

interface AnimatedIconProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function AnimatedIcon({ children, delay = 0, className = "" }: AnimatedIconProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={prefersReducedMotion ? instant : bounceIn}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
