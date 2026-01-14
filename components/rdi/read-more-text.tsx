"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReadMoreTextProps {
    text: string;
    maxWords?: number;
    className?: string;
}

export function ReadMoreText({ text, maxWords = 28, className = "" }: ReadMoreTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Split text into words
    const words = text.split(/\s+/);
    const shouldTruncate = words.length > maxWords;

    // Get truncated text (first maxWords words)
    const truncatedText = shouldTruncate
        ? words.slice(0, maxWords).join(" ")
        : text;

    // Display text based on expanded state
    const displayText = isExpanded || !shouldTruncate ? text : truncatedText;

    return (
        <div className={className}>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed text-justify">
                {displayText}
                {shouldTruncate && !isExpanded && "..."}
            </p>
            {shouldTruncate && (
                <Button
                    variant="link"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-0 h-auto font-semibold text-primary hover:text-primary/80 mt-1"
                >
                    {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
                </Button>
            )}
        </div>
    );
}
