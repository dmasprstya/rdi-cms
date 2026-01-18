"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Pause, Play, Calendar } from "lucide-react";
import { HeroContent, HeroImage, NewsItem } from "@/lib/rdi-data";
import Image from "next/image";
import Link from "next/link";
import { ReadMoreText } from "@/components/rdi/read-more-text";
import { heroTitle, heroSubtitle, heroButton } from "@/lib/animations/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroSectionProps {
    content: HeroContent;
    images: HeroImage[];
    newsItems: NewsItem[];
}

// News Card Component - Memoized to prevent unnecessary re-renders
const NewsCard = memo(function NewsCard({ news }: { news: NewsItem }) {
    return (
        <Link href={`/berita/${news.slug}`}>
            <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Card className="group overflow-hidden cursor-pointer h-full shadow-md hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative h-28 sm:h-32 overflow-hidden">
                        {news.image && (
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-110 duration-500"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 100vw, 35vw"
                            />
                        )}

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
                            <Badge
                                variant={news.category === "Overseas" ? "default" : "secondary"}
                                className="font-semibold text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
                            >
                                {news.category}
                            </Badge>
                        </div>
                    </div>

                    <CardHeader className="pb-1.5 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-muted-foreground mb-1">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>{new Date(news.date).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</span>
                        </div>

                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm">
                            {news.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                        <CardDescription className="line-clamp-2 text-[10px] sm:text-xs">
                            {news.excerpt}
                        </CardDescription>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
});
NewsCard.displayName = 'NewsCard';

// Main component with all hooks at top level
export function HeroSection({ content, images, newsItems }: HeroSectionProps) {
    // All hooks must be at top level - no conditional calls
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [validImages, setValidImages] = useState(images);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const prefersReduced = useReducedMotion();

    const duration = content.slideshowDuration || 6000;

    // Detect prefers-reduced-motion
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Update validImages when images prop changes
    useEffect(() => {
        setValidImages(images);
    }, [images]);

    // Disable auto-play if user prefers reduced motion - Memoized
    const shouldAutoPlay = useMemo(
        () => !prefersReducedMotion && (content.enableAutoPlay !== false) && isPlaying,
        [prefersReducedMotion, content.enableAutoPlay, isPlaying]
    );

    // Auto-advance slideshow
    useEffect(() => {
        if (!shouldAutoPlay || validImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, duration);

        return () => clearInterval(interval);
    }, [shouldAutoPlay, duration, validImages.length]);

    // Handle image load error
    const handleImageError = useCallback((imageId: string) => {
        console.warn(`[HERO_IMAGE_LOAD_ERROR] Image failed to load: ${imageId}`);
        setValidImages((prev) => {
            const newImages = prev.filter((img) => img.id !== imageId);
            return newImages.length > 0 ? newImages : prev;
        });
    }, []);

    // Scroll to programs
    const scrollToPrograms = () => {
        const element = document.getElementById("program-pillars");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    // Priority 1: Video mode (if explicitly set)
    if (content.displayMode === 'video' && content.videoUrl) {
        return <VideoHeroLayout content={content} scrollToPrograms={scrollToPrograms} newsItems={newsItems} />;
    }

    // Priority 2: No images → Placeholder
    if (!images || images.length === 0) {
        return <DefaultHeroLayout content={content} scrollToPrograms={scrollToPrograms} newsItems={newsItems} />;
    }

    // Priority 3: Single image → Static
    if (images.length === 1) {
        return <StaticHeroLayout content={content} image={images[0]} scrollToPrograms={scrollToPrograms} newsItems={newsItems} />;
    }

    // Slideshow render
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
                    {/* Left Column - Hero Section with Image/Video Background */}
                    <div className="relative flex flex-col">
                        {/* Hero Content Area with Background */}
                        <div
                            className="relative flex-1 min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] flex items-end lg:mt-8"
                            onMouseEnter={() => setIsPlaying(false)}
                            onMouseLeave={() => setIsPlaying(true)}
                        >
                            {/* Slideshow Background Images */}
                            <div className="absolute inset-0 z-0">
                                {validImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                                        style={{
                                            opacity: index === currentIndex ? 1 : 0,
                                            zIndex: index === currentIndex ? 1 : 0,
                                        }}
                                    >
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.altText}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                            sizes="(max-width: 1024px) 100vw, 66vw"
                                            quality={index === 0 ? 90 : 85}
                                            onError={() => handleImageError(image.id)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Slideshow Controls */}
                            {!prefersReducedMotion && validImages.length > 1 && (
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-2.5 rounded-full transition-all duration-300"
                                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                                >
                                    {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                </button>
                            )}

                            {/* Slideshow Indicators */}
                            {validImages.length > 1 && (
                                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                                    {validImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? 'bg-white w-6 sm:w-8'
                                                : 'bg-white/50 hover:bg-white/75 w-1.5'
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Animated Gradient Overlay */}
                            <div className="absolute inset-0 z-[1] pointer-events-none">
                                <div
                                    className="absolute inset-0 animate-gradient-shift"
                                    style={{
                                        background: "linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
                                        backgroundSize: "200% 200%"
                                    }}
                                />
                            </div>

                            {/* Hero Text Content */}
                            <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                    {content.logoUrl && (
                                        <motion.div
                                            className="flex justify-start mb-2 sm:mb-4"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                                                <Image
                                                    src={content.logoUrl}
                                                    alt="Logo Institute"
                                                    fill
                                                    className="object-contain drop-shadow-2xl"
                                                    priority
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.h1
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight"
                                        initial="hidden"
                                        animate="visible"
                                        variants={prefersReduced ? undefined : heroTitle}
                                    >
                                        {content.title}
                                    </motion.h1>

                                    <motion.p
                                        className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl"
                                        initial="hidden"
                                        animate="visible"
                                        variants={prefersReduced ? undefined : heroSubtitle}
                                    >
                                        {content.subtitle}
                                    </motion.p>

                                    <motion.div
                                        className="pt-1 sm:pt-2"
                                        initial="hidden"
                                        animate="visible"
                                        variants={prefersReduced ? undefined : heroButton}
                                    >
                                        <Button
                                            onClick={scrollToPrograms}
                                            size="lg"
                                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs sm:text-sm md:text-base px-6 py-4 sm:px-8 sm:py-6 rounded-full shadow-xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
                                        >
                                            {content.buttonText}
                                            <ArrowDown className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* About Section - Below Hero */}
                        {content.aboutTitle && content.aboutDescription && (
                            <div className="bg-background border-t py-4 sm:py-6 md:py-8">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                                    {content.aboutTitle}
                                </h2>
                                <ReadMoreText text={content.aboutDescription} maxWords={28} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - News Sidebar */}
                    <div className="flex flex-col bg-background border-t lg:border-t-0">
                        <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-4">
                                {content.newsSidebarTitle || 'Berita Terbaru'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                                {newsItems.slice(0, 3).map((news, index) => (
                                    <NewsCard key={index} news={news} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Video background layout
function VideoHeroLayout({ content, scrollToPrograms, newsItems }: { content: HeroContent; scrollToPrograms: () => void; newsItems: NewsItem[] }) {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
                    {/* Left Column - Two separate sections stacked */}
                    <div className="flex flex-col">
                        {/* Top: Video & Hero Content */}
                        <div className="relative flex-1 min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] flex items-end lg:mt-8">
                            {/* Video Background */}
                            <div className="absolute inset-0 z-0">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src={content.videoUrl} type="video/mp4" />
                                </video>
                            </div>

                            {/* Hero Text Content */}
                            <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                    {content.logoUrl && (
                                        <div className="flex justify-start mb-2 sm:mb-4">
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                                                <Image
                                                    src={content.logoUrl}
                                                    alt="Logo Institute"
                                                    fill
                                                    className="object-contain drop-shadow-2xl"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                                        {content.title}
                                    </h1>

                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl">
                                        {content.subtitle}
                                    </p>

                                    <div className="pt-1 sm:pt-2">
                                        <Button
                                            onClick={scrollToPrograms}
                                            size="lg"
                                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs sm:text-sm md:text-base px-6 py-4 sm:px-8 sm:py-6 rounded-full shadow-xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
                                        >
                                            {content.buttonText}
                                            <ArrowDown className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Sekilas Tentang - Separate with its own background */}
                        {content.aboutTitle && content.aboutDescription && (
                            <div className="bg-background py-4 sm:py-6 md:py-8">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                                    {content.aboutTitle}
                                </h2>
                                <ReadMoreText text={content.aboutDescription} maxWords={28} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - News Sidebar */}
                    <div className="bg-background border-t lg:border-t-0 py-6 sm:py-8 px-4 sm:px-6 lg:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-foreground col-span-full">
                                {content.newsSidebarTitle || 'Berita Terbaru'}
                            </h3>
                            {newsItems.slice(0, 3).map((news, index) => (
                                <NewsCard key={index} news={news} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Static image layout
function StaticHeroLayout({ content, image, scrollToPrograms, newsItems }: { content: HeroContent; image: HeroImage; scrollToPrograms: () => void; newsItems: NewsItem[] }) {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
                    {/* Left Column - Two separate sections stacked */}
                    <div className="flex flex-col">
                        {/* Top: Static Image & Hero Content */}
                        <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] flex items-center">
                            {/* Static Background */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 65vw"
                                    quality={90}
                                />
                            </div>

                            {/* Hero Content */}
                            <div className="relative z-10 w-full">
                                <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                                    <div className="max-w-2xl space-y-4 sm:space-y-6 animate-fade-in-up">
                                        {content.logoUrl && (
                                            <div className="mb-4 sm:mb-6 flex justify-start animate-fade-in">
                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
                                                    <Image
                                                        src={content.logoUrl}
                                                        alt="Logo Institute"
                                                        fill
                                                        className="object-contain drop-shadow-2xl"
                                                        priority
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                            {content.title}
                                        </h1>

                                        <p className="text-sm sm:text-base md:text-lg text-gray-200">
                                            {content.subtitle}
                                        </p>

                                        <div className="pt-1 sm:pt-2">
                                            <Button
                                                onClick={scrollToPrograms}
                                                size="lg"
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm md:text-base px-5 py-4 sm:px-6 sm:py-5 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                                            >
                                                {content.buttonText}
                                                <ArrowDown className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Sekilas Tentang - Separate with its own background */}
                        {content.aboutTitle && content.aboutDescription && (
                            <div className="bg-background py-4 sm:py-6 md:py-8">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                                    {content.aboutTitle}
                                </h2>
                                <ReadMoreText text={content.aboutDescription} maxWords={28} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - News Sidebar */}
                    <div className="bg-background border-t lg:border-t-0 py-6 sm:py-8 px-4 sm:px-6 lg:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-foreground col-span-full">
                                {content.newsSidebarTitle || 'Berita Terbaru'}
                            </h3>
                            {newsItems.slice(0, 3).map((news, index) => (
                                <NewsCard key={index} news={news} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


// Fallback component for no images
function DefaultHeroLayout({ content, scrollToPrograms, newsItems }: { content: HeroContent; scrollToPrograms: () => void; newsItems: NewsItem[] }) {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
                    {/* Left Column - Two separate sections stacked */}
                    <div className="flex flex-col">
                        {/* Top: Hero Content */}
                        <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] flex items-center bg-gradient-to-br from-primary/20 to-background">
                            {/* Hero Content */}
                            <div className="relative z-10 w-full">
                                <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                                    <div className="max-w-2xl space-y-4 sm:space-y-6">
                                        {content.logoUrl && (
                                            <div className="mb-4 sm:mb-6 flex justify-start">
                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
                                                    <Image
                                                        src={content.logoUrl}
                                                        alt="Logo Institute"
                                                        fill
                                                        className="object-contain drop-shadow-2xl"
                                                        priority
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                                            {content.title}
                                        </h1>

                                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                                            {content.subtitle}
                                        </p>

                                        <div className="pt-1 sm:pt-2">
                                            <Button
                                                onClick={scrollToPrograms}
                                                size="lg"
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm md:text-base px-5 py-4 sm:px-6 sm:py-5 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                                            >
                                                {content.buttonText}
                                                <ArrowDown className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Sekilas Tentang - Separate with its own background */}
                        {content.aboutTitle && content.aboutDescription && (
                            <div className="bg-background py-4 sm:py-6 md:py-8">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                                    {content.aboutTitle}
                                </h2>
                                <ReadMoreText text={content.aboutDescription} maxWords={28} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - News Sidebar */}
                    <div className="bg-background border-t lg:border-t-0 py-6 sm:py-8 px-4 sm:px-6 lg:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-foreground col-span-full">
                                {content.newsSidebarTitle || 'Berita Terbaru'}
                            </h3>
                            {newsItems.slice(0, 3).map((news, index) => (
                                <NewsCard key={index} news={news} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

