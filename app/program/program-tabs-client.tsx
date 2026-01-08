'use client';

import { useState } from 'react';
import { ProgramCategoryTabs } from '@/components/rdi/program-category-tabs';
import { ProgramItemCard } from '@/components/rdi/program-item-card';
import { TabsContent } from '@/components/ui/tabs';
import type { ProgramCategory, ProgramItem } from '@/lib/program-data';

interface ProgramTabsClientProps {
    categories: ProgramCategory[];
    items: ProgramItem[];
}

export function ProgramTabsClient({ categories, items }: ProgramTabsClientProps) {
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

    return (
        <ProgramCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
        >
            {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-6 md:mt-8">
                    {/* Category Description */}
                    <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
                            {category.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                            {category.description}
                        </p>
                    </div>

                    {/* Program Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {items
                            .filter((item) => item.categoryId === category.id)
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                                <ProgramItemCard
                                    key={item.id}
                                    item={item}
                                    category={category}
                                />
                            ))}
                    </div>

                    {/* Empty State */}
                    {items.filter((item) => item.categoryId === category.id).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Belum ada program dalam kategori ini
                            </p>
                        </div>
                    )}
                </TabsContent>
            ))}
        </ProgramCategoryTabs>
    );
}
