'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'sts-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    // Load theme from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored && (stored === 'light' || stored === 'dark')) {
            setTheme(stored);
        }
    }, [storageKey]);

    // Update localStorage when theme changes
    useEffect(() => {
        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        theme,
        setTheme: (newTheme: Theme) => {
            setTheme(newTheme);
        },
    }), [theme]);

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
