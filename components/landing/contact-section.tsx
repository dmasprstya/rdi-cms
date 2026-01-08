import { Mail, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

interface ContactContent {
    sectionTitle: string;
    sectionSubtitle: string;
    email: string;
    phone: string;
    alternativeText: string;
}

interface ContactSectionProps {
    content?: ContactContent;
}

const defaultContent: ContactContent = {
    sectionTitle: 'Hubungi Kami',
    sectionSubtitle: 'Ada pertanyaan atau ingin mencoba sistem kami? Isi form di bawah ini dan tim kami akan segera menghubungi Anda.',
    email: 'info@sts-system.com',
    phone: '+62 812-3456-7890',
    alternativeText: 'Atau hubungi kami langsung',
};

export function ContactSection({ content }: ContactSectionProps) {
    const data = content || defaultContent;

    // Format phone for tel: link
    const phoneLink = data.phone.replace(/[^0-9+]/g, '');

    return (
        <section id="kontak" className="container mx-auto px-4 py-20 md:py-32">
            <div className="text-center space-y-8 mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                    {data.sectionTitle}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {data.sectionSubtitle}
                </p>
            </div>

            {/* Contact Form */}
            <ContactForm />

            {/* Alternative Contact Methods */}
            <div className="mt-12 text-center space-y-6">
                <p className="text-muted-foreground text-sm uppercase tracking-wider">{data.alternativeText}</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>{data.email}</span>
                    </a>
                    <a href={`tel:${phoneLink}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>{data.phone}</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
