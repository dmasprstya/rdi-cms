import { Variants } from "framer-motion";
import { easings } from "./easings";

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: easings.smooth
    }
};

export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: easings.smooth
    }
};

export const fadeInDown: Variants = {
    hidden: {
        opacity: 0,
        y: -40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: easings.smooth
    }
};

export const fadeInLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -60
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: easings.smooth
    }
};

export const fadeInRight: Variants = {
    hidden: {
        opacity: 0,
        x: 60
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: easings.smooth
    }
};

export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: easings.spring
    }
};

export const scaleInOut: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: easings.spring
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: easings.fast
    }
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

export const staggerContainerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
};

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: easings.spring
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

export const skeletonPulse: Variants = {
    pulse: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const floatingIcon: Variants = {
    float: {
        y: [-8, 8, -8],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const instant: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0
        }
    }
};

// Bounce/Pulse effect for icons
export const bounceIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.6
        }
    }
};

export const pulse: Variants = {
    initial: {
        scale: 1
    },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Enhanced stagger for card grids
export const staggerGrid: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15
        }
    }
};

export const gridItem: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: easings.smooth
    }
};

// Image zoom hover (used with whileHover)
export const imageZoom = {
    scale: 1.1,
    transition: {
        duration: 0.5,
        ease: "easeOut"
    }
};

// Button hover animations
export const buttonHover = {
    y: -2,
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

export const buttonHoverWithShadow = {
    y: -3,
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

// Parallax variants
export const parallaxBackground = {
    initial: { y: 0 },
    animate: (scrollY: number) => ({
        y: scrollY * 0.5, // Scroll at half speed
        transition: {
            duration: 0,
            ease: "linear"
        }
    })
};

// Hero text animations
export const heroTitle: Variants = {
    hidden: {
        opacity: 0,
        y: 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut"
        }
    }
};

export const heroSubtitle: Variants = {
    hidden: {
        opacity: 0,
        y: 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut"
        }
    }
};

export const heroButton: Variants = {
    hidden: {
        opacity: 0,
        y: 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.5,
            ease: "easeOut"
        }
    }
};
