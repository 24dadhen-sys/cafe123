import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT update menu item
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, price, description, categoryId, isAvailable } = body;

        const item = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                price,
                description,
                categoryId,
                isAvailable,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error updating menu item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

// DELETE menu item
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.menuItem.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
