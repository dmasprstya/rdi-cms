"use client";


import { Button } from "@/components/ui/button";

import { CTAContent } from "@/lib/rdi-data";

// WhatsApp Logo SVG Component
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

interface CTASectionProps {
    content: CTAContent;
}

export function CTASection({ content }: CTASectionProps) {

    // Generate WhatsApp URLs
    const overseasUrl = `https://wa.me/${content.waNumberOverseas}?text=${encodeURIComponent(content.messageOverseas)}`;
    const haltecUrl = `https://wa.me/${content.waNumberHaltec}?text=${encodeURIComponent(content.messageHaltec)}`;

    return (
        <section id="kontak" className="relative py-24 overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {/* WhatsApp Badge - Moved to top for better visual flow */}
                    <div className="mb-6 inline-flex items-center gap-2 bg-[#25D366]/10 px-5 py-2.5 rounded-full border border-[#25D366]/30 backdrop-blur-sm">
                        <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                        <span className="text-xs sm:text-sm font-semibold text-foreground">Chat Via WhatsApp</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                        {content.title}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                {/* CTA Buttons - Improved spacing and visual hierarchy */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-stretch max-w-3xl mx-auto mb-10">
                    <a
                        href={overseasUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-5 text-sm sm:text-base md:text-lg font-semibold rounded-xl bg-card/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#25D366] hover:text-white border border-border relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        <WhatsAppIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="relative z-10">{content.button1Text}</span>
                    </a>

                    <a
                        href={haltecUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-5 text-sm sm:text-base md:text-lg font-semibold rounded-xl bg-card/50 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#25D366] hover:text-white border border-border relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        <WhatsAppIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="relative z-10">{content.button2Text}</span>
                    </a>
                </div>

                {/* Additional Info - Better typography */}
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                        {content.additionalInfo}
                    </p>
                </div>
            </div>
        </section>
    );
}
