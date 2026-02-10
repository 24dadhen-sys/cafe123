import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all menu items with categories
export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({
            include: {
                category: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching menu:", error);
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}

// POST create new menu item
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, description, categoryId, isAvailable } = body;

        const item = await prisma.menuItem.create({
            data: {
                name,
                price,
                description,
                categoryId,
                isAvailable: isAvailable ?? true,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error creating menu item:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
