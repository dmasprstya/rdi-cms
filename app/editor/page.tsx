import Link from 'next/link';
import {
    Video,
    Users,
    Target,
    Award,
    User,
    Newspaper,
    MessageCircle,
    Footprints,
    Menu as MenuIcon,
    ArrowRight,
    Eye,
    Clock,
    CheckCircle,
    Briefcase
} from 'lucide-react';

const sections = [
    {
        title: 'Hero Section',
        description: 'Edit judul utama, deskripsi, dan video background hero section RDI.',
        href: '/editor/hero',
        icon: Video,
        color: 'from-blue-500 to-cyan-500',
        status: 'published'
    },
    {
        title: 'Navbar',
        description: 'Kelola menu navigasi, logo, dan dropdown program RDI.',
        href: '/editor/navbar',
        icon: MenuIcon,
        color: 'from-slate-500 to-gray-500',
        status: 'published'
    },
    {
        title: 'Trust Partners',
        description: 'Atur logo dan daftar partner institusi yang dipercaya.',
        href: '/editor/trust-partners',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
        status: 'published'
    },
    {
        title: 'Programs',
        description: 'Kelola kategori dan item program: Pelatihan Kerja, Motivasi & Beasiswa.',
        href: '/editor/programs',
        icon: Briefcase,
        color: 'from-cyan-500 to-blue-600',
        status: 'published'
    },
    {
        title: 'Why RDI',
        description: 'Edit keunggulan dan alasan memilih Rosman Djohan Institute.',
        href: '/editor/why-rdi',
        icon: Award,
        color: 'from-yellow-500 to-amber-500',
        status: 'published'
    },
    {
        title: 'Founders Section',
        description: 'Update informasi pendiri, visi, dan quote inspiratif.',
        href: '/editor/founders',
        icon: User,
        color: 'from-indigo-500 to-blue-500',
        status: 'published'
    },
    {
        title: 'Latest News',
        description: 'Kelola berita terbaru dan kegiatan institusi.',
        href: '/editor/latest-news',
        icon: Newspaper,
        color: 'from-pink-500 to-rose-500',
        status: 'published'
    },
    {
        title: 'CTA Section',
        description: 'Edit call-to-action untuk mendaftar atau hubungi kami.',
        href: '/editor/cta',
        icon: MessageCircle,
        color: 'from-orange-500 to-red-500',
        status: 'published'
    },
    {
        title: 'Footer',
        description: 'Update informasi kontak, link sosial media, dan copyright.',
        href: '/editor/footer',
        icon: Footprints,
        color: 'from-teal-500 to-cyan-500',
        status: 'published'
    },
];

export default function EditorDashboardPage() {
    return (
        <div className="space-y-8 pb-20 lg:pb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">RDI Landing Page Editor</h1>
                <p className="mt-2 text-muted-foreground">
                    Kelola konten halaman landing page Rosman Djohan Institute
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">9</p>
                            <p className="text-xs text-muted-foreground">Dipublikasi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">0</p>
                            <p className="text-xs text-muted-foreground">Draft</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Eye className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">9</p>
                            <p className="text-xs text-muted-foreground">Total Section</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 border border-border col-span-2 lg:col-span-1">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                            <Eye className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-yellow-400 transition-colors">Lihat Landing Page</p>
                            <p className="text-xs text-muted-foreground">Buka di tab baru</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Section Cards */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Kelola Section RDI</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/5"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${section.status === 'published'
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    {section.status === 'published' ? (
                                        <>
                                            <CheckCircle className="w-3 h-3" />
                                            Published
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-3 h-3" />
                                            Draft
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg mb-4`}>
                                <section.icon className="w-6 h-6 text-foreground" />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-yellow-400 transition-colors">
                                {section.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {section.description}
                            </p>

                            {/* Action */}
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Edit Section</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Eye className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Tentang RDI Landing Page</h3>
                        <p className="text-sm text-muted-foreground">
                            Landing page ini dirancang khusus untuk Rosman Djohan Institute.
                            Semua konten dapat diedit melalui CMS ini dan akan otomatis
                            diterapkan di halaman utama.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
