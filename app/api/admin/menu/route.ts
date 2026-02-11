
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const menuItems = await prisma.menuItem.findMany({
            include: { category: true },
            orderBy: { category: { name: 'asc' } }
        });
        return NextResponse.json(menuItems);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, price, categoryId, description, imageUrl, isAvailable } = body;

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                price: parseFloat(price),
                categoryId,
                description,
                imageUrl,
                isAvailable
            }
        });

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error("Error creating menu item:", error);
        return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
    }
}
