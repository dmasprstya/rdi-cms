"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    disableOnMobile?: boolean;
    once?: boolean;
}

export function ScrollReveal({
    children,
    delay = 0,
    className = '',
    disableOnMobile = true,
    once = true
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        // Check if mobile
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

        // Skip animation if conditions met
        if (prefersReducedMotion || (disableOnMobile && isMobile)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [once, disableOnMobile, prefersReducedMotion]);

    return (
        <div
            ref={ref}
            className={cn(className)}
            style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity 0.3s ease-out ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}
