"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

import { NavbarContent } from "@/lib/rdi-data";
import { ProgramsContent } from "@/lib/program-data";

interface NavbarRDIProps {
    content: NavbarContent;
    programsContent: ProgramsContent;
}

export function NavbarRDI({ content, programsContent }: NavbarRDIProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

    // Close mobile menu when clicking a link
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsProgramDropdownOpen(false);
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-md border-b border-border"
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        {content.logoUrl ? (
                            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                                <Image
                                    src={content.logoUrl}
                                    alt={content.logoText}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="40px"
                                />
                            </div>
                        ) : (
                            <GraduationCap className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                        )}
                        <span
                            className="text-lg sm:text-xl lg:text-2xl font-bold"
                            style={{ color: content.logoTextColor || 'inherit' }}
                        >
                            {content.logoText}
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {content.menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="hover:text-primary transition-colors font-medium text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Program Link with Separate Dropdown */}
                        <div className="flex items-center gap-1">
                            <Link
                                href="/program"
                                className="hover:text-primary transition-colors font-medium text-foreground"
                            >
                                Program
                            </Link>

                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-primary p-0 h-auto w-auto px-1 text-foreground">
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-4 w-[400px] lg:w-[500px]">
                                                {programsContent.categories
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((category) => (
                                                        <li key={category.id}>
                                                            <NavigationMenuLink asChild>
                                                                <Link
                                                                    href={`/program/${category.slug}`}
                                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                >
                                                                    <div className="text-sm font-medium leading-none">
                                                                        {category.title}
                                                                    </div>
                                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                                        {category.description}
                                                                    </p>
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <ThemeToggle />

                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            <Link href="/#kontak">{content.contactText}</Link>
                        </Button>

                        <Button asChild variant="ghost" className="bg-primary/10 backdrop-blur-sm text-primary hover:bg-primary/20 hover:text-primary font-semibold">
                            <Link href="/login">{content.loginText}</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-muted rounded-md transition-colors text-foreground"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                            {content.menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className="hover:text-primary transition-colors font-medium py-2 text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Mobile Program Dropdown */}
                            <div>
                                <button
                                    onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                                    className="flex items-center justify-between w-full hover:text-primary transition-colors font-medium py-2 text-foreground"
                                >
                                    Program
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform",
                                            isProgramDropdownOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                {isProgramDropdownOpen && (
                                    <div className="pl-4 mt-2 space-y-2 animate-slide-in">
                                        {programsContent.categories
                                            .sort((a, b) => a.order - b.order)
                                            .map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/program/${category.slug}`}
                                                    onClick={closeMobileMenu}
                                                    className="block text-muted-foreground hover:text-primary transition-colors py-2"
                                                >
                                                    {category.title}
                                                </Link>
                                            ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-border pt-4">
                                <span className="text-sm sm:text-base font-medium text-foreground">Mode Tampilan</span>
                                <ThemeToggle />
                            </div>

                            <div className="flex flex-col gap-2 pt-4">
                                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                    <Link href="/#kontak" onClick={closeMobileMenu}>{content.contactText}</Link>
                                </Button>

                                <Button asChild variant="ghost" className="w-full bg-primary/10 backdrop-blur-sm text-primary hover:bg-primary/20 hover:text-primary font-semibold">
                                    <Link href="/login" onClick={closeMobileMenu}>{content.loginText}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
