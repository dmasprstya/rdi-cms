"use client";

import { useReducedMotion } from "./useReducedMotion";

export function useScrollAnimation(options?: {
    threshold?: number;
    triggerOnce?: boolean;
    margin?: string;
}) {
    const prefersReduced = useReducedMotion();

    const {
        threshold = 0.2,
        triggerOnce = true,
        margin = "-100px"
    } = options || {};

    if (prefersReduced) {
        return {
            viewport: {
                once: false,
                amount: 0
            },
            transition: {
                duration: 0
            }
        };
    }

    return {
        viewport: {
            once: triggerOnce,
            amount: threshold,
            margin: margin
        }
    };
}
