import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { ProgramItem } from '@/lib/program-data';

interface ProgramItemCardProps {
    item: ProgramItem;
    category: {
        badge: string;
        gradientFrom: string;
        gradientTo: string;
    };
}

export function ProgramItemCard({ item, category }: ProgramItemCardProps) {
    return (
        <Card className="group cursor-pointer card-hover overflow-hidden border-2 hover:border-primary transition-all duration-300">
            {/* Featured Image Header */}
            <div
                className="relative h-40 sm:h-44 md:h-48 overflow-hidden"
                style={{
                    background: `linear-gradient(to bottom right, var(--${category.gradientFrom}), var(--${category.gradientTo}))`
                }}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.featuredImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <Badge className="bg-primary text-primary-foreground text-xs md:text-sm">
                        {category.badge}
                    </Badge>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-primary-foreground transition-colors">
                        {item.title}
                    </h3>
                </div>
            </div>

            <CardHeader className="pb-3 md:pb-6">
                <CardDescription className="text-xs sm:text-sm md:text-base">
                    {item.shortDescription}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 md:space-y-4 pb-16 sm:pb-20 relative">
                {/* Key Features */}
                <div className="mb-12 sm:mb-14">
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-2">Keuntungan:</h4>
                    <ul className="space-y-1 md:space-y-1.5">
                        {item.keyFeatures.slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5 md:space-x-2">
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA Button */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base font-semibold group-hover:shadow-lg transition-all">
                        <Link href={item.ctaButtonLink}>
                            {item.ctaButtonText}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
