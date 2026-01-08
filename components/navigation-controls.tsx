'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface NavigationControlsProps {
    showForward?: boolean;
    preventBackToLogin?: boolean;
    fallbackPath?: string;
    allowedPathPrefix?: string; // e.g., '/student' or '/dashboard'
    forceBackToPath?: string; // Always go to this path when back is clicked
}

export function NavigationControls({
    showForward = true,
    preventBackToLogin = false,
    fallbackPath = '/',
    allowedPathPrefix,
    forceBackToPath
}: NavigationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [canGoForward, setCanGoForward] = useState(false);
    const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

    useEffect(() => {
        // Initialize navigation history from sessionStorage
        const storedHistory = sessionStorage.getItem('navigationHistory');
        if (storedHistory) {
            setNavigationHistory(JSON.parse(storedHistory));
        }

        // Add current path to history
        const currentPath = pathname || '/';
        setNavigationHistory(prev => {
            const newHistory = [...prev, currentPath];
            sessionStorage.setItem('navigationHistory', JSON.stringify(newHistory));
            return newHistory;
        });

        // Check if there's forward history on navigation
        const handleNavigation = () => {
            setCanGoForward(false);
        };

        window.addEventListener('popstate', handleNavigation);
        return () => window.removeEventListener('popstate', handleNavigation);
    }, [pathname]);

    const isPathAllowed = (path: string): boolean => {
        if (!path) return false;

        // List of paths that should always be blocked
        const blockedPaths = ['/login', '/'];
        if (blockedPaths.includes(path) || path.includes('/login')) {
            return false;
        }

        // If allowedPathPrefix is set, check if path starts with it
        if (allowedPathPrefix) {
            return path.startsWith(allowedPathPrefix);
        }

        return true;
    };

    const handleBack = () => {
        // If forceBackToPath is defined, always go there
        if (forceBackToPath) {
            router.push(forceBackToPath);
            return;
        }

        // Get navigation history
        const storedHistory = sessionStorage.getItem('navigationHistory');
        if (storedHistory) {
            const history = JSON.parse(storedHistory);
            const currentIndex = history.length - 1;
            const previousPath = history[currentIndex - 1];

            // Check if we should prevent going back
            if (preventBackToLogin || allowedPathPrefix) {
                // If no valid previous path or previous path is not allowed, go to fallback
                if (!previousPath || !isPathAllowed(previousPath)) {
                    router.push(fallbackPath);
                    // Update history
                    const newHistory = history.slice(0, -1);
                    sessionStorage.setItem('navigationHistory', JSON.stringify(newHistory));
                    return;
                }
            }
        }

        router.back();
        // After going back, forward might become available
        setTimeout(() => setCanGoForward(true), 100);
    };

    const handleForward = () => {
        if (canGoForward) {
            router.forward();
            setCanGoForward(false);
        }
    };

    const buttonClass = 'h-8 w-8 p-0 bg-card hover:bg-accent border-border hover:border-accent text-foreground hover:text-accent-foreground transition-colors';

    const disabledButtonClass = 'h-8 w-8 p-0 bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50';

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className={buttonClass}
                title="Kembali"
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            {showForward && (
                <Button
                    onClick={handleForward}
                    variant="outline"
                    size="sm"
                    className={canGoForward ? buttonClass : disabledButtonClass}
                    title="Maju"
                    disabled={!canGoForward}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
