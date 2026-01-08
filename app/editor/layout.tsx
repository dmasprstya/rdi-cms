import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { EditorSidebar } from '@/components/editor/sidebar';

export default async function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'editor') {
        if (session.user.role === 'student') {
            redirect('/student');
        }
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <EditorSidebar user={session.user} />

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 h-auto min-h-[64px] bg-card/80 backdrop-blur-xl border-b border-border">
                    <div className="h-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">RDI Content Management System</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Kelola konten RDI Landing Page</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <span className="text-sm text-muted-foreground hidden md:block truncate max-w-[150px] lg:max-w-none">
                                {session.user.email}
                            </span>
                            <form action={async () => {
                                'use server';
                                const { signOut } = await import('@/auth');
                                await signOut();
                            }}>
                                <button
                                    type="submit"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-xs sm:text-sm font-medium transition-all border border-red-500/20 whitespace-nowrap"
                                >
                                    Keluar
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-3 sm:p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
