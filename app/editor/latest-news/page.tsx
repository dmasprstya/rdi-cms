'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LatestNewsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/editor/news');
    }, [router]);

    return null;
}
