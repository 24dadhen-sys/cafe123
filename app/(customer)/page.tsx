
import { PrismaClient } from "@prisma/client";
import { MenuItem } from "@/components/customer/MenuItem";
import { CartSheet } from "@/components/customer/CartSheet";
import Image from "next/image";

// We use the server component directly for the main page to fetch data
// We need to re-instantiate prisma here because it's a server component and we can't import from lib/prisma in some nextjs configs if it has "server-only" constraints, but utilizing our lib/prisma is usually fine.
// Actually, let's use the API route approach or directly fetch if we are in app dir.
// For simplicity and performance, direct DB call in Server Component is best.
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getMenu() {
    return await prisma.category.findMany({
        include: {
            items: {
                where: { isAvailable: true },
            },
        },
        orderBy: {
            name: 'asc' // or however you want to sort
        }
    });
}

export default async function CustomerHome() {
    const categories = await getMenu();

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
                        LOGO
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Sippin's Cafe</h1>
                        <p className="text-xs text-gray-500">Deliciousness served daily</p>
                    </div>
                </div>
            </div>

            {/* Categories Scroll */}
            <div className="bg-white border-b sticky top-[72px] z-10 overflow-x-auto flex gap-6 px-4 py-3 no-scrollbar">
                {categories.map(cat => (
                    <a href={`#category-${cat.id}`} key={cat.id} className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        {cat.name}
                    </a>
                ))}
            </div>

            {/* Menu List */}
            <div className="p-4 space-y-8">
                {categories.map((category) => (
                    <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">{category.name}</h2>
                        <div className="space-y-4">
                            {category.items.map(itm => (
                                console.log(itm),
                                <MenuItem key={itm.id} item={itm} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <CartSheet />
        </div>
    );
}
