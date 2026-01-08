'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Loading fallback component
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                    <p className="text-muted-foreground text-center">
                        Memuat halaman...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

// Compact loader for smaller components
function CompactLoader() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
    );
}

// ============ ADMIN COMPONENTS (Heavy > 25KB) ============
export const LazyModulesManagement = dynamic(
    () => import('@/components/admin/modules-management').then((mod) => ({ default: mod.ModulesManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false, // Client-side only for interactive components
    }
);

export const LazyStudentsManagement = dynamic(
    () => import('@/components/admin/students-management').then((mod) => ({ default: mod.StudentsManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

export const LazyGradesManagement = dynamic(
    () => import('@/components/admin/grades-management').then((mod) => ({ default: mod.GradesManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

export const LazyTeachersManagement = dynamic(
    () => import('@/components/admin/teachers-management').then((mod) => ({ default: mod.TeachersManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

export const LazyAnnouncementsManagement = dynamic(
    () => import('@/components/admin/announcements-management').then((mod) => ({ default: mod.AnnouncementsManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

// ============ ADMIN COMPONENTS (Medium 10-25KB) ============
export const LazyClassesManagement = dynamic(
    () => import('@/components/admin/classes-management').then((mod) => ({ default: mod.ClassesManagement })),
    {
        loading: () => <CompactLoader />,
        ssr: false,
    }
);

export const LazyKelasMataPelajaranManagement = dynamic(
    () => import('@/components/admin/kelas-mata-pelajaran-management').then((mod) => ({ default: mod.KelasMataPelajaranManagement })),
    {
        loading: () => <CompactLoader />,
        ssr: false,
    }
);

export const LazyDashboardStats = dynamic(
    () => import('@/components/admin/dashboard-stats').then((mod) => ({ default: mod.DashboardStats })),
    {
        loading: () => <CompactLoader />,
        ssr: true, // Can SSR since it's mostly display
    }
);

// ============ GURU COMPONENTS ============
export const LazyGuruGradeInput = dynamic(
    () => import('@/components/guru/grade-input').then((mod) => ({ default: mod.GradeInputManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

export const LazyGuruModulesManagement = dynamic(
    () => import('@/components/guru/modules-management').then((mod) => ({ default: mod.ModulesManagement })),
    {
        loading: () => <PageLoader />,
        ssr: false,
    }
);

export const LazyGuruAnnouncementsManagement = dynamic(
    () => import('@/components/guru/announcements-management').then((mod) => ({ default: mod.AnnouncementsManagement })),
    {
        loading: () => <CompactLoader />,
        ssr: false,
    }
);

// ============ UI COMPONENTS ============
export const LazyContactForm = dynamic(
    () => import('@/components/contact-form').then((mod) => ({ default: mod.ContactForm })),
    {
        loading: () => <CompactLoader />,
        ssr: true, // Can SSR for better SEO
    }
);

// ============ RECHARTS (Heavy charting library) ============
// Only load charts when needed
export const LazyBarChart = dynamic(
    () => import('recharts').then((mod) => ({ default: mod.BarChart })),
    {
        loading: () => <CompactLoader />,
        ssr: false,
    }
);

export const LazyLineChart = dynamic(
    () => import('recharts').then((mod) => ({ default: mod.LineChart })),
    {
        loading: () => <CompactLoader />,
        ssr: false,
    }
);

// Re-export loaders for use in other components
export { PageLoader, CompactLoader };
