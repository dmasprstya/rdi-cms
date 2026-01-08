'use client';

import { useTheme } from '@/components/theme-provider';
import { ReactNode } from 'react';

interface ThemeBackgroundProps {
    children: ReactNode;
}

export function ThemeBackground({ children }: ThemeBackgroundProps) {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen text-foreground ${theme === 'dark' ? 'gradient-dark' : 'gradient-light'}`}>
            {children}
        </div>
    );
}
