import Image from "next/image";
import { TrustPartnersContent } from "@/lib/rdi-data";

interface TrustPartnersSectionProps {
    content: TrustPartnersContent;
}

export function TrustPartnersSection({ content }: TrustPartnersSectionProps) {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wide mb-3 sm:mb-4">
                        {content.tagline}
                    </p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground px-4">
                        {content.title}
                    </h2>
                </div>

                {/* Partner Logos */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16">
                    {content.partners.map((partner, idx) => (
                        <div
                            key={idx}
                            className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 flex-shrink-0"
                        >
                            <div className="relative w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-16 lg:w-36 lg:h-18 flex items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
