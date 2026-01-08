
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

import { FooterContent } from "@/lib/rdi-data";
import { ProgramsContent } from "@/lib/program-data";

interface FooterRDIProps {
    content: FooterContent;
    programsContent: ProgramsContent;
}

export function FooterRDI({ content, programsContent }: FooterRDIProps) {
    // Sort categories by order
    const sortedCategories = [...programsContent.categories].sort((a, b) => a.order - b.order);

    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            {content.logoUrl ? (
                                <div className="relative w-8 h-8">
                                    <Image
                                        src={content.logoUrl}
                                        alt={content.logoText}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <GraduationCap className="w-8 h-8 text-primary" />
                            )}
                            <span className="text-lg sm:text-xl font-bold text-foreground">{content.logoText}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {content.description}
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <Link
                                href={content.socialMedia.facebook}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                            >
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link
                                href={content.socialMedia.instagram}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link
                                href={content.socialMedia.youtube}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                            >
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link
                                href={content.socialMedia.linkedin}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Menu Program - Dynamic */}
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Menu Program</h3>
                        <ul className="space-y-2">
                            {sortedCategories.map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={`/program/${category.slug}`}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {category.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legalitas */}
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Legalitas</h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <li>NIB: {content.legalitas.nib}</li>
                            <li>Izin LPK: {content.legalitas.izinLpk}</li>
                            <li>NPWP: {content.legalitas.npwp}</li>
                            <li>{content.legalitas.status}</li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Kontak</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                                <MapPin className="w-5 h-5 flex-shrink-0 text-primary" />
                                <span>{content.contact.address}</span>
                            </li>
                            <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="w-5 h-5 text-primary" />
                                <a href={`mailto:${content.contact.email}`} className="hover:text-primary transition-colors">
                                    {content.contact.email}
                                </a>
                            </li>
                            <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="w-5 h-5 text-primary" />
                                <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                                    {content.contact.phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-8 pt-8 text-center text-xs sm:text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} {content.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
