import { TestimonialCard } from './testimonial-card';

interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    school: string;
}

interface TestimonialsContent {
    sectionTitle: string;
    sectionSubtitle: string;
    testimonials: Testimonial[];
}

interface TestimonialsSectionProps {
    content?: TestimonialsContent;
}

const defaultContent: TestimonialsContent = {
    sectionTitle: 'Testimoni Pengguna',
    sectionSubtitle: 'Apa yang mereka katakan tentang sistem kami',
    testimonials: [
        {
            id: '1',
            quote: 'Sistem ini sangat membantu dalam mengelola data siswa dan nilai. Interface yang mudah dipahami membuat pekerjaan admin menjadi lebih efisien.',
            name: 'Budi Santoso',
            role: 'Kepala Sekolah',
            school: 'SMA Negeri 1'
        },
        {
            id: '2',
            quote: 'Fitur analytics dan reporting sangat powerful. Kami bisa membuat keputusan berbasis data dengan lebih cepat dan akurat.',
            name: 'Siti Nurhaliza',
            role: 'Staff Admin',
            school: 'SMP Islam Al-Azhar'
        },
        {
            id: '3',
            quote: 'Sebagai guru, saya terbantu dengan fitur manajemen nilai dan jadwal. Semuanya terintegrasi dengan baik dan mudah diakses.',
            name: 'Ahmad Dhani',
            role: 'Guru Matematika',
            school: 'SMK Teknologi 45'
        },
    ],
};

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
    const data = content || defaultContent;

    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    {data.sectionTitle}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {data.sectionSubtitle}
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {data.testimonials.map((testimonial) => (
                    <TestimonialCard
                        key={testimonial.id}
                        quote={testimonial.quote}
                        name={testimonial.name}
                        role={testimonial.role}
                        school={testimonial.school}
                    />
                ))}
            </div>
        </section>
    );
}
