'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

import { FoundersContent } from "@/lib/rdi-data";

interface FoundersSectionProps {
    content: FoundersContent;
}

export function FoundersSection({ content }: FoundersSectionProps) {

    return (
        <section id="tentang-kami" className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                        {content.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                {/* Founders Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {content.founders.map((founder, idx) => (
                        <Card
                            key={idx}
                            className="bg-card/50 backdrop-blur-sm border-border hover:bg-card transition-all duration-300 overflow-hidden group"
                        >
                            <CardContent className="p-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center text-center space-y-6">
                                    {/* Founder Avatar */}
                                    {founder.image ? (
                                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300 shadow-lg">
                                            <Image
                                                src={founder.image}
                                                alt={founder.name}
                                                fill
                                                sizes="160px"
                                                className="object-cover"
                                                onError={(e) => {
                                                    // Fallback to placeholder if image fails to load
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const placeholder = target.parentElement?.querySelector('.placeholder-fallback') as HTMLElement;
                                                    if (placeholder) placeholder.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback placeholder inside avatar */}
                                            <div className="placeholder-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20" style={{ display: 'none' }}>
                                                <span className="text-5xl font-bold text-muted-foreground">
                                                    {founder.name.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/20 shadow-lg">
                                            <span className="text-5xl font-bold text-muted-foreground">
                                                {founder.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Vision Badge */}
                                    <div className="inline-block px-5 py-2 bg-primary/90 rounded-full shadow-md">
                                        <span className="text-xs sm:text-sm font-semibold text-primary-foreground">
                                            {founder.vision}
                                        </span>
                                    </div>

                                    {/* Name and Role */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                                            {founder.name}
                                        </h3>
                                        <p className="text-sm sm:text-base text-muted-foreground font-medium">{founder.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

