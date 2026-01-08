'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    PlaySquare,
    Users,
    Target,
    Award,
    User,
    Newspaper,
    MessageCircle,
    Footprints,
    Settings,
    ChevronRight,
    Sparkles,
    Menu as MenuIcon,
    Briefcase,
    X
} from 'lucide-react';

interface EditorSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

const menuItems = [
    {
        title: 'Dashboard',
        href: '/editor',
        icon: LayoutDashboard,
        description: 'Overview & Statistik'
    },
    {
        title: 'Hero Section',
        href: '/editor/hero',
        icon: PlaySquare,
        description: 'Banner Utama'
    },
    {
        title: 'Navbar',
        href: '/editor/navbar',
        icon: MenuIcon,
        description: 'Menu Navigasi'
    },
    {
        title: 'Trust Partners',
        href: '/editor/trust-partners',
        icon: Users,
        description: 'Logo Partner'
    },
    {
        title: 'Programs',
        href: '/editor/programs',
        icon: Briefcase,
        description: 'Kategori & Item'
    },
    {
        title: 'Berita',
        href: '/editor/news',
        icon: Newspaper,
        description: 'Berita & Kegiatan'
    },
    {
        title: 'Why RDI',
        href: '/editor/why-rdi',
        icon: Award,
        description: 'Keunggulan RDI'
    },
    {
        title: 'Founders',
        href: '/editor/founders',
        icon: User,
        description: 'Para Pendiri'
    },
    {
        title: 'Latest News',
        href: '/editor/latest-news',
        icon: Newspaper,
        description: 'Berita Terbaru'
    },
    {
        title: 'CTA Section',
        href: '/editor/cta',
        icon: MessageCircle,
        description: 'Call to Action'
    },
    {
        title: 'Footer',
        href: '/editor/footer',
        icon: Footprints,
        description: 'Footer & Sosial Media'
    },
];

export function EditorSidebar({ user }: EditorSidebarProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-card border border-border rounded-xl shadow-lg"
            >
                {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-foreground" />
                ) : (
                    <MenuIcon className="w-6 h-6 text-foreground" />
                )}
            </button>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-card backdrop-blur-xl border-r border-border px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">CMS Editor</h1>
                            <p className="text-xs text-muted-foreground">Sistem Terintegrasi</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-muted rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0) || 'E'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{user.name || 'Editor'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`group flex items-center gap-x-3 rounded-xl px-3 py-3 text-sm transition-all ${isActive
                                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{item.title}</p>
                                                <p className={`text-xs truncate ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Settings Link */}
                        <div className="mt-auto pt-4 border-t border-border">
                            <Link
                                href="/editor/settings"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center gap-x-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                            >
                                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium">Pengaturan</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card backdrop-blur-xl border-r border-border px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">CMS Editor</h1>
                            <p className="text-xs text-muted-foreground">Sistem Terintegrasi</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-muted rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0) || 'E'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{user.name || 'Editor'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center gap-x-3 rounded-xl px-3 py-3 text-sm transition-all ${isActive
                                                ? 'bg-primary/10 text-primary border border-primary/20'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{item.title}</p>
                                                <p className={`text-xs truncate ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Settings Link */}
                        <div className="mt-auto pt-4 border-t border-border">
                            <Link
                                href="/editor/settings"
                                className="group flex items-center gap-x-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                            >
                                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium">Pengaturan</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card backdrop-blur-xl border-t border-border">
                <nav className="flex items-center justify-around px-2 py-2">
                    {menuItems.slice(0, 5).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${isActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.title.split(' ')[0]}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
