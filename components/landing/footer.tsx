import { GraduationCap, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface QuickLink {
    id: string;
    label: string;
    href: string;
}

interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

interface FooterContent {
    brandDescription: string;
    quickLinksTitle: string;
    quickLinks: QuickLink[];
    contactTitle: string;
    email: string;
    phone: string;
    socialLinks: SocialLink[];
    copyrightText: string;
}

interface FooterProps {
    content?: FooterContent;
}

// Map platform names to icons
const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
};

const defaultContent: FooterContent = {
    brandDescription: 'Platform manajemen sekolah modern untuk meningkatkan efisiensi dan produktivitas institusi pendidikan.',
    quickLinksTitle: 'Tautan Cepat',
    quickLinks: [
        { id: '1', label: 'Beranda', href: '#beranda' },
        { id: '2', label: 'Layanan', href: '#layanan' },
        { id: '3', label: 'Tentang', href: '#tentang' },
        { id: '4', label: 'Kebijakan Privasi', href: '#' },
        { id: '5', label: 'Syarat Penggunaan', href: '#' },
    ],
    contactTitle: 'Kontak & Media Sosial',
    email: 'info@sts-system.com',
    phone: '+62 812-3456-7890',
    socialLinks: [
        { id: '1', platform: 'facebook', url: '#' },
        { id: '2', platform: 'twitter', url: '#' },
        { id: '3', platform: 'instagram', url: '#' },
        { id: '4', platform: 'linkedin', url: '#' },
    ],
    copyrightText: 'Sistem Terintegrasi Sekolah. All rights reserved.',
};

export function Footer({ content }: FooterProps) {
    const data = content || defaultContent;

    // Format phone for tel: link
    const phoneLink = data.phone.replace(/[^0-9+]/g, '');

    return (
        <footer className="border-t border-border bg-card">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-12 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-yellow-400/10 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-yellow-400" />
                            </div>
                            <span className="text-xl font-bold text-foreground">
                                STS <span className="text-primary">System</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {data.brandDescription}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">{data.quickLinksTitle}</h3>
                        <ul className="space-y-2">
                            {data.quickLinks.map((link) => (
                                <li key={link.id}>
                                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">{data.contactTitle}</h3>
                        <div className="space-y-3">
                            <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>{data.email}</span>
                            </a>
                            <a href={`tel:${phoneLink}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>{data.phone}</span>
                            </a>
                        </div>
                        <div className="flex gap-4 pt-4">
                            {data.socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    className="p-2 bg-secondary rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                                    aria-label={social.platform}
                                >
                                    {socialIconMap[social.platform] || <Facebook className="w-5 h-5" />}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-border text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {data.copyrightText}</p>
                </div>
            </div>
        </footer>
    );
}
