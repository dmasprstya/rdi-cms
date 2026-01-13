import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { NavigationControls } from '@/components/navigation-controls';

export default async function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'staff') {
        // Redirect non-staff users to their appropriate dashboards
        if (session.user.role === 'student') {
            redirect('/student');
        }
        if (session.user.role === 'editor') {
            redirect('/editor');
        }
        if (session.user.role === 'guru') {
            redirect('/guru');
        }
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg sm:text-xl">S</span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                                Dashboard Staff
                            </h1>
                            <p className="text-xs text-muted-foreground truncate">
                                {session.user.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <NavigationControls
                            preventBackToLogin={true}
                            fallbackPath="/staff"
                            allowedPathPrefix="/staff"
                        />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden md:inline-block truncate max-w-[150px] lg:max-w-none">
                            {session.user.email}
                        </span>
                        <form action={async () => {
                            'use server';
                            await signOut();
                        }}>
                            <button
                                type="submit"
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                            >
                                Keluar
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
