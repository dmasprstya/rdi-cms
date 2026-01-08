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
                <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
                    <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">RDI Content Management System</h2>
                            <p className="text-sm text-muted-foreground">Kelola konten RDI Landing Page</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {session.user.email}
                            </span>
                            <form action={async () => {
                                'use server';
                                const { signOut } = await import('@/auth');
                                await signOut();
                            }}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-all border border-red-500/20"
                                >
                                    Keluar
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
