
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

import { LatestNewsContent } from "@/lib/rdi-data";

interface LatestNewsSectionProps {
    content: LatestNewsContent;
}

export function LatestNewsSection({ content }: LatestNewsSectionProps) {

    return (
        <section id="berita" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        {content.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                        {content.subtitle}
                    </p>
                </div>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {content.newsItems.map((news, index) => (
                        <Card
                            key={index}
                            className="group overflow-hidden card-hover cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                {news.image && (
                                    <Image
                                        src={news.image}
                                        alt={news.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                )}

                                {/* Dark overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <Badge
                                        variant={news.category === "Overseas" ? "default" : "secondary"}
                                        className="font-semibold"
                                    >
                                        {news.category}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader>
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(news.date).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}</span>
                                </div>

                                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                                    {news.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <CardDescription className="line-clamp-3 mb-4">
                                    {news.excerpt}
                                </CardDescription>

                                <Link
                                    href={`/berita/${news.slug}`}
                                    className="inline-flex items-center text-sm sm:text-base text-primary hover:text-primary/80 font-semibold group/link"
                                >
                                    Baca Selengkapnya
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href={content.viewAllLink}
                        className="inline-flex items-center px-6 py-3 text-sm sm:text-base bg-muted hover:bg-muted/80 rounded-lg font-semibold transition-colors"
                    >
                        {content.viewAllText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
