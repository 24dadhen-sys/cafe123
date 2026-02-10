import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChefHat, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { MenuItemCard } from '@/components/customer/MenuItemCard';
import { CartSheet } from '@/components/customer/CartSheet';

// Fallback Mock Data if DB is empty
const MOCK_CATEGORIES = [
    { id: 'cat_1', name: 'Coffee' },
    { id: 'cat_2', name: 'Snacks' },
    { id: 'cat_3', name: 'Desserts' },
];

const MOCK_ITEMS = [
    { id: 'item_1', name: 'Cappuccino', price: 120, description: 'Rich espresso with steamed milk foam', categoryId: 'cat_1', isAvailable: true, imageUrl: null },
    { id: 'item_2', name: 'Latte', price: 140, description: 'Smooth espresso with steamed milk', categoryId: 'cat_1', isAvailable: true, imageUrl: null },
    { id: 'item_3', name: 'French Fries', price: 90, description: 'Crispy salted fries', categoryId: 'cat_2', isAvailable: true, imageUrl: null },
    { id: 'item_4', name: 'Chocolate Cake', price: 180, description: 'Decadent chocolate fudge cake', categoryId: 'cat_3', isAvailable: true, imageUrl: null },
];

async function getMenuData() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                items: {
                    where: { isAvailable: true }
                }
            }
        });

        if (categories.length === 0) {
            // Return Mock Data structure if DB is empty
            return MOCK_CATEGORIES.map(cat => ({
                ...cat,
                items: MOCK_ITEMS.filter(item => item.categoryId === cat.id)
            }));
        }

        return categories;
    } catch (error) {
        console.error("Database connection failed, using mock data", error);
        // Return Mock Data structure on error
        return MOCK_CATEGORIES.map(cat => ({
            ...cat,
            items: MOCK_ITEMS.filter(item => item.categoryId === cat.id)
        }));
    }
}

export default async function TablePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const menuCategories = await getMenuData();

    return (
        <div className="min-h-screen bg-background pb-20 relative">
            {/* Sticky Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-foreground">Table {id}</h1>
                        <p className="text-xs text-muted-foreground">Sippin&apos;s Cafe</p>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Category Scroll (Optional - simpler for now just list) */}
            </header>

            <main className="container mx-auto px-4 py-6 space-y-8">
                {/* Hero / Greeting */}
                <div className="bg-primary/5 rounded-xl p-6 flex items-center justify-between border border-primary/10">
                    <div>
                        <h2 className="text-xl font-bold text-primary mb-1">Hungry?</h2>
                        <p className="text-sm text-muted-foreground">We have fresh brews waiting for you.</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-primary" />
                    </div>
                </div>

                {/* Menu Sections */}
                {menuCategories.map((category) => (
                    category.items.length > 0 && (
                        <section key={category.id} id={category.name} className="scroll-mt-20">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full block"></span>
                                {category.name}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {category.items.map((item) => (
                                    <MenuItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    )
                ))}

                {menuCategories.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No menu items found.</p>
                    </div>
                )}
            </main>

            {/* Floating Cart Button Position */}
            <div className="fixed bottom-6 right-6 z-40">
                <CartSheet />
            </div>
        </div>
    );
}
