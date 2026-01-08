'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MenuItem {
    title: string;
    slug: string;
}

interface NavbarDropdownProps {
    title: string;
    items: MenuItem[];
}

export function NavbarDropdown({ title, items }: NavbarDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (items.length === 0) return null;

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/${item.slug}`}
                            className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// Mobile version
export function MobileNavbarDropdown({ title, items }: NavbarDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (items.length === 0) return null;

    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-muted-foreground hover:text-primary transition-colors font-medium py-2"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="pl-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/${item.slug}`}
                            className="block text-muted-foreground hover:text-primary transition-colors py-2"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
