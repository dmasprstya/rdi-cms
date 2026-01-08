interface AboutContent {
    sectionTitle: string;
    paragraph1: string;
    paragraph2: string;
}

interface AboutSectionProps {
    content?: AboutContent;
}

const defaultContent: AboutContent = {
    sectionTitle: 'Tentang Sistem Kami',
    paragraph1: 'Sistem Terintegrasi Sekolah (STS) adalah platform manajemen sekolah yang dikembangkan dengan teknologi modern untuk membantu institusi pendidikan mengelola operasional sehari-hari dengan lebih efisien dan terorganisir.',
    paragraph2: 'Dengan antarmuka yang intuitif dan fitur yang komprehensif, STS memungkinkan admin, staff, dan siswa untuk berkolaborasi dalam satu ekosistem digital yang terintegrasi.',
};

export function AboutSection({ content }: AboutSectionProps) {
    const data = content || defaultContent;

    return (
        <section id="tentang" className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                    {data.sectionTitle}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {data.paragraph1}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {data.paragraph2}
                </p>
            </div>
        </section>
    );
}
