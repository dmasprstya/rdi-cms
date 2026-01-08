import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground mb-6 ml-4">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-primary transition-colors truncate"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium truncate">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    )}
                </div>
            ))}
        </nav>
    );
}
