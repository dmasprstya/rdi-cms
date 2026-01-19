"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when user scrolls down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Add scroll event listener
        window.addEventListener("scroll", toggleVisibility);

        // Cleanup
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
        fixed bottom-8 right-8 z-50
        w-14 h-14 flex items-center justify-center rounded-full
        bg-gradient-to-br from-blue-600 to-blue-700
        text-white shadow-lg
        hover:from-blue-700 hover:to-blue-800
        hover:shadow-xl hover:scale-110
        active:scale-95
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"}
      `}
            aria-label="Kembali ke atas"
            title="Kembali ke atas"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
}
