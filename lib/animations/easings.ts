/**
 * Centralized easing and timing functions
 */

export const easings = {
    easeInOut: [0.4, 0.0, 0.2, 1] as const,
    easeOut: [0.0, 0.0, 0.2, 1] as const,
    easeIn: [0.4, 0.0, 1, 1] as const,

    spring: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
    },

    springBouncy: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
    },

    springSmooth: {
        type: "spring" as const,
        stiffness: 200,
        damping: 35
    },

    smooth: {
        type: "tween" as const,
        ease: "easeOut" as const,
        duration: 0.5
    },

    fast: {
        type: "tween" as const,
        ease: "easeOut" as const,
        duration: 0.3
    },

    slow: {
        type: "tween" as const,
        ease: "easeInOut" as const,
        duration: 0.8
    }
} as const;
