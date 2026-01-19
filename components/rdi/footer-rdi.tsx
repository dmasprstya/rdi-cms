import { FooterRDI as FooterRDIClient } from './footer-rdi-client';
import { fetchRDISection, FooterContent, getNavbarContent } from '@/lib/rdi-data';
import { getProgramsContent } from '@/lib/program-data';

const DEFAULT_FOOTER: FooterContent = {
    logoText: 'RDI',
    logoUrl: undefined,
    description: 'Rosman Djohan Institute - Lembaga pendidikan vokasi terpadu untuk karir internasional dan sertifikasi halal.',
    socialMedia: {
        facebook: '#',
        instagram: '#',
        tiktok: '#',
    },
    legalitas: {
        nib: '1234567890123456',
        izinLpk: 'SK/012/2024',
        npwp: '12.345.678.9-012.000',
        status: 'Terakreditasi Resmi',
    },
    contact: {
        address: 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
        email: 'info@rosmandjohan.id',
        phone: '+62 21 1234 5678',
    },
    copyright: 'Rosman Djohan Institute. All rights reserved.',
};

export async function FooterRDI() {
    // Fetch navbar content to get logo info
    const navbarContent = await getNavbarContent();

    // Fetch footer content
    const footerContent = await fetchRDISection<FooterContent>('rdi-footer') || DEFAULT_FOOTER;

    // Fetch programs content for menu
    const programsContent = await getProgramsContent();

    // Merge logo from navbar into footer
    const content = {
        ...footerContent,
        logoText: navbarContent.logoText,
        logoUrl: navbarContent.logoUrl,
    };

    return <FooterRDIClient content={content} programsContent={programsContent} />;
}
