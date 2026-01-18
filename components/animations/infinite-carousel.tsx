"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InfiniteCarouselProps {
    children: ReactNode[];
    speed?: number; // Duration for one full loop in seconds
    pauseOnHover?: boolean;
    className?: string;
}

export function InfiniteCarousel({
    children,
    speed = 30,
    pauseOnHover = true,
    className = ""
}: InfiniteCarouselProps) {
    const controls = useAnimationControls();
    const prefersReducedMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate children for seamless loop
    const items = [...children, ...children];

    useEffect(() => {
        if (prefersReducedMotion) return;

        const animate = async () => {
            await controls.start({
                x: "-50%",
                transition: {
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                }
            });
        };

        if (!isPaused) {
            animate();
        }
    }, [controls, speed, isPaused, prefersReducedMotion]);

    const handleHoverStart = () => {
        if (pauseOnHover && !prefersReducedMotion) {
            setIsPaused(true);
            controls.stop();
        }
    };

    const handleHoverEnd = () => {
        if (pauseOnHover && !prefersReducedMotion) {
            setIsPaused(false);
        }
    };

    if (prefersReducedMotion) {
        // Show static version for reduced motion
        return (
            <div className={className}>
                <div className="flex gap-4 flex-wrap justify-center">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16"
                animate={controls}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                style={{ width: "max-content" }}
            >
                {items}
            </motion.div>
        </div>
    );
}
