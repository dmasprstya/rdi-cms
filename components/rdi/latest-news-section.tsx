"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { LatestNewsContent } from "@/lib/rdi-data";

interface LatestNewsSectionProps {
    content: LatestNewsContent;
}

export function LatestNewsSection({ content }: LatestNewsSectionProps) {
    return (
        <section id="berita" className="py-20 bg-muted/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            {content.title}
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            {content.subtitle}
                        </p>
                    </div>
                </ScrollReveal>

                {/* News Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
                    {content.newsItems.map((news, idx) => (
                        <ScrollReveal
                            key={idx}
                            delay={idx * 0.05}
                            disableOnMobile={true}
                        >
                            <Link
                                href={`/berita/${news.slug}`}
                                className="block"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -8 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-border h-full"
                                >
                                    {/* News Image */}
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                                        <Image
                                            src={news.image}
                                            alt={news.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                                {news.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-3">
                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(news.date).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg md:text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                            {news.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                            {news.excerpt}
                                        </p>

                                        {/* Read More Link */}
                                        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                                            <span>Baca Selengkapnya</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                {/* View All Button */}
                {content.newsItems.length > 0 && (
                    <ScrollReveal>
                        <div className="text-center">
                            <Link
                                href={content.viewAllLink}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
                            >
                                <span>{content.viewAllText}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </ScrollReveal>
                )}

                {/* Empty State */}
                {content.newsItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            Belum ada berita yang dipublikasikan.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
