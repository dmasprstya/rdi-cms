import { ReactNode } from 'react';

// Force all pages in /berita to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BeritaLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}