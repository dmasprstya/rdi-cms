import { Users, BookOpen, BarChart3, Shield, Calendar, Bell, Settings, Star } from 'lucide-react';
import { FeatureCard } from './feature-card';

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

interface FeaturesContent {
    sectionTitle: string;
    sectionSubtitle: string;
    features: Feature[];
}

interface FeaturesSectionProps {
    content?: FeaturesContent;
}

// Map icon names to components
const iconMap: Record<string, React.ReactNode> = {
    Users: <Users className="w-8 h-8" />,
    BookOpen: <BookOpen className="w-8 h-8" />,
    BarChart3: <BarChart3 className="w-8 h-8" />,
    Shield: <Shield className="w-8 h-8" />,
    Calendar: <Calendar className="w-8 h-8" />,
    Bell: <Bell className="w-8 h-8" />,
    Settings: <Settings className="w-8 h-8" />,
    Star: <Star className="w-8 h-8" />,
};

const defaultContent: FeaturesContent = {
    sectionTitle: 'Fitur Unggulan',
    sectionSubtitle: 'Dirancang untuk memenuhi kebutuhan sekolah modern dengan teknologi terkini',
    features: [
        { id: '1', icon: 'Users', title: 'Manajemen Siswa', description: 'Kelola data siswa dengan mudah, termasuk profil, kelas, dan informasi pribadi' },
        { id: '2', icon: 'BookOpen', title: 'Nilai & Jadwal', description: 'Catat nilai akademik dan atur jadwal pelajaran secara efisien' },
        { id: '3', icon: 'BarChart3', title: 'Dashboard Analytics', description: 'Visualisasi data dengan grafik dan statistik yang informatif' },
        { id: '4', icon: 'Shield', title: 'Role-Based Access', description: 'Keamanan berlapis dengan akses berbasis peran pengguna' },
    ],
};

export function FeaturesSection({ content }: FeaturesSectionProps) {
    const data = content || defaultContent;

    return (
        <section id="layanan" className="container mx-auto px-4 py-20 md:py-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    {data.sectionTitle}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {data.sectionSubtitle}
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        icon={iconMap[feature.icon] || <Star className="w-8 h-8" />}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}
