'use client';

import { useEffect, useState } from 'react';
import GradeInputForm from '@/components/guru/grade-input-form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GradeInputData {
    classes: any[];
    subjectsByClass: Record<string, any[]>;
    studentsByClass: Record<string, any[]>;
    existingGrades: Record<string, any[]>;
}

/**
 * Client-side grade input page
 * This ensures session cookies are sent with the API request
 */
export default function GuruGradesPage() {
    const [data, setData] = useState<GradeInputData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/guru/grade-input-data', {
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch grade input data');
                }

                const result = await response.json();
                setData(result);
            } catch (err: any) {
                console.error('Error fetching grade input data:', err);
                setError(err.message || 'Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <p className="text-muted-foreground">Memuat data...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive font-semibold mb-2">Error</p>
                        <p className="text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="container mx-auto py-6">
            <GradeInputForm initialData={data} />
        </div>
    );
}
