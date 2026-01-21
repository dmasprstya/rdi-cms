'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Award, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { ScrollReveal } from "@/components/animations/scroll-reveal";

interface PillarFeature {
    text: string;
}

interface Pillar {
    badge: string;
    title: string;
    description: string;
    features: PillarFeature[];
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    gradientFrom: string;
    gradientTo: string;
}

interface CorePillarsContent {
    title: string;
    subtitle: string;
    pillars: Pillar[];
}

interface CorePillarsSectionProps {
    content: CorePillarsContent;
}

export function CorePillarsSection({ content }: CorePillarsSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        slidesToScroll: 1,
        skipSnaps: false,
        containScroll: 'trimSnaps',
    });

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        onSelect();

        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    // Icon mapping for badges
    const getIcon = (index: number) => {
        return index === 0 ? Globe : Award;
    };

    return (
        <section id="program-pillars" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            {content.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
                            {content.subtitle}
                        </p>
                    </div>
                </ScrollReveal>

                {/* Carousel Container */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Carousel Viewport */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4 md:gap-6">
                            {content.pillars.map((pillar, index) => {
                                const Icon = getIcon(index);
                                return (
                                    <div
                                        key={index}
                                        className="flex-[0_0_100%] sm:flex-[0_0_85%] md:flex-[0_0_75%] lg:flex-[0_0_calc(50%-16px)] min-w-0 shrink-0"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.03, y: -6 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="h-full"
                                        >
                                            <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl">
                                                <div
                                                    className="relative h-48 sm:h-56 md:h-64 overflow-hidden"
                                                    style={{
                                                        background: `linear-gradient(to bottom right, var(--${pillar.gradientFrom}), var(--${pillar.gradientTo}))`
                                                    }}
                                                >
                                                    {/* Image */}
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                        style={{ backgroundImage: `url('${pillar.imageUrl}')` }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                                    {/* Overlay Content */}
                                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                                                        <div className="flex items-center space-x-1.5 md:space-x-2 mb-2">
                                                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                            <span className="text-white text-xs md:text-sm font-semibold uppercase tracking-wide">
                                                                {pillar.badge}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <CardHeader className="pb-3 md:pb-6">
                                                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                                                        {pillar.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs sm:text-sm md:text-base">
                                                        {pillar.description}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="relative pb-20 sm:pb-24 flex-grow">
                                                    <div>
                                                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-2 md:mb-3">
                                                            Program Tersedia:
                                                        </h4>
                                                        <ul className="space-y-1.5 md:space-y-2 min-h-[100px] md:min-h-[120px]">
                                                            {pillar.features.slice(0, 3).map((feature, featureIndex) => (
                                                                <li key={featureIndex} className="flex items-start space-x-1.5 md:space-x-2">
                                                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                                                                    <span className="text-xs sm:text-sm text-muted-foreground">{feature.text}</span>
                                                                </li>
                                                            ))}
                                                            {pillar.features.length > 3 && (
                                                                <li className="flex items-center justify-center pt-2">
                                                                    <span className="text-muted-foreground font-bold tracking-widest">• • •</span>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                                                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base font-semibold group-hover:shadow-lg transition-all">
                                                            <Link href={pillar.buttonLink}>
                                                                {pillar.buttonText}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    {content.pillars.length > 1 && (
                        <>
                            {/* Desktop: Arrow Buttons */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 rounded-full bg-background shadow-lg hover:bg-accent"
                                onClick={scrollPrev}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 rounded-full bg-background shadow-lg hover:bg-accent"
                                onClick={scrollNext}
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile: Dot Indicators */}
                {content.pillars.length > 1 && (
                    <div className="flex md:hidden justify-center gap-2 mt-6">
                        {content.pillars.map((_, index) => (
                            <button
                                key={index}
                                className={`
                                    h-2 rounded-full transition-all duration-300
                                    ${selectedIndex === index
                                        ? 'bg-primary w-8'
                                        : 'bg-muted-foreground/30 w-2'
                                    }
                                `}
                                onClick={() => emblaApi?.scrollTo(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={selectedIndex === index ? 'true' : 'false'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section >
    );
}
