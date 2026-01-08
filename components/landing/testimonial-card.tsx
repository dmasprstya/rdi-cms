import { Quote } from 'lucide-react';

interface TestimonialCardProps {
    quote: string;
    name: string;
    role: string;
    school: string;
}

export function TestimonialCard({ quote, name, role, school }: TestimonialCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
            <Quote className="w-10 h-10 text-primary/50" />
            <p className="text-muted-foreground leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
            <div className="pt-4 border-t border-border">
                <p className="text-card-foreground font-semibold">{name}</p>
                <p className="text-primary text-sm">{role}</p>
                <p className="text-muted-foreground text-sm">{school}</p>
            </div>
        </div>
    );
}
