import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramCategory } from '@/lib/program-data';
import * as LucideIcons from 'lucide-react';

interface ProgramCategoryTabsProps {
    categories: ProgramCategory[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
    children: React.ReactNode;
}

export function ProgramCategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
    children,
}: ProgramCategoryTabsProps) {
    return (
        <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
            <TabsList className="flex flex-col md:grid w-full gap-1.5 md:gap-2 h-auto p-0 md:p-2" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                {categories.map((category) => {
                    // Dynamically get icon from lucide-react
                    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Briefcase;

                    return (
                        <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-center leading-tight">
                                {category.title}
                            </span>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            {children}
        </Tabs>
    );
}
