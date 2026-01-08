'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    whiteIcons?: boolean;
}

export function ThemeToggle({ whiteIcons = false }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "hover:text-primary hover:bg-primary/10",
                        whiteIcons ? "text-white" : "text-muted-foreground"
                    )}
                    suppressHydrationWarning
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className="cursor-pointer text-card-foreground hover:text-primary hover:bg-primary/10"
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Mode Terang</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className="cursor-pointer text-card-foreground hover:text-primary hover:bg-primary/10"
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Mode Gelap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

