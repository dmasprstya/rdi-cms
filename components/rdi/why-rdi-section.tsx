
import { Network, Users, Shield, Award, Target, CheckCircle, Globe, BookOpen, LucideIcon } from "lucide-react";

import { WhyRDIContent } from "@/lib/rdi-data";

interface WhyRDISectionProps {
    content: WhyRDIContent;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Network,
    Users,
    Shield,
    Award,
    Target,
    CheckCircle,
    Globe,
    BookOpen,
};

export function WhyRDISection({ content }: WhyRDISectionProps) {

    return (
        <section className="py-20 bg-muted/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        {content.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {content.features.map((feature, idx) => {
                        const Icon = iconMap[feature.icon] || Network;
                        return (
                            <div
                                key={idx}
                                className="text-center space-y-4 p-6 rounded-xl hover:bg-card transition-all duration-300 group"
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                                    <Icon className="w-8 h-8" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
