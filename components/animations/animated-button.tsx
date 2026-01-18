"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "hero";
    type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
    children,
    onClick,
    className = "",
    variant = "default",
    type = "button",
}: AnimatedButtonProps) {
    const prefersReducedMotion = useReducedMotion();

    const hoverAnimation = variant === "hero"
        ? { y: -3, scale: 1.02, transition: { duration: 0.3 } }
        : { y: -2, transition: { duration: 0.3 } };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            whileHover={prefersReducedMotion ? undefined : hoverAnimation}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className={cn(className)}
        >
            {children}
        </motion.button>
    );
}
