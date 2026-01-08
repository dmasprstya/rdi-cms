import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl ml-4">
                        <div className="h-10 bg-muted rounded animate-pulse w-32 mb-6" />
                        <div className="h-12 bg-muted rounded animate-pulse mb-4 w-96" />
                        <div className="h-6 bg-muted rounded animate-pulse w-64" />
                    </div>
                </div>
            </section>

            {/* News Grid Skeleton */}
            <section className="container mx-auto px-4 py-12 md:py-5">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <div className="w-full aspect-video bg-muted animate-pulse" />
                            <CardContent className="p-6 space-y-3">
                                <div className="h-4 bg-muted rounded animate-pulse w-20" />
                                <div className="space-y-2">
                                    <div className="h-6 bg-muted rounded animate-pulse" />
                                    <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse" />
                                    <div className="h-4 bg-muted rounded animate-pulse" />
                                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                                </div>
                                <div className="h-4 bg-muted rounded animate-pulse w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}