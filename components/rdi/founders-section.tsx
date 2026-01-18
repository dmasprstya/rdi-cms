import Image from "next/image";
import { Quote } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { FoundersContent } from "@/lib/rdi-data";

interface FoundersSectionProps {
    content: FoundersContent;
}

export function FoundersSection({ content }: FoundersSectionProps) {
    return (
        <section id="tentang-kami" className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                            {content.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            {content.subtitle}
                        </p>
                    </div>
                </ScrollReveal>

                {/* Founders Grid */}
                <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {content.founders.map((founder, idx) => (
                        <ScrollReveal
                            key={idx}
                            delay={idx * 0.05}
                            disableOnMobile={true}
                        >
                            <div
                                className="bg-card rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
                            >
                                {/* Circular Avatar with Ring */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-36 h-36 md:w-40 md:h-40">
                                        <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background relative">
                                            <Image
                                                src={founder.image}
                                                alt={founder.name}
                                                fill
                                                className="object-cover object-center"
                                                sizes="160px"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Vision Badge - Yellow */}
                                <div className="flex justify-center mb-4">
                                    <div className="inline-block px-5 py-2 bg-amber-400 dark:bg-amber-500 rounded-full">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-950">
                                            {founder.vision}
                                        </p>
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-2">
                                    {founder.name}
                                </h3>

                                {/* Role */}
                                <p className="text-sm md:text-base text-center text-muted-foreground font-medium">
                                    {founder.role}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
