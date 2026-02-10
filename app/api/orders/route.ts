import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST create new order
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerName, mobileNumber, tableNumber, type, specialNote } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate total amount from DB prices to avoid manipulation
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const dbItem = await prisma.menuItem.findUnique({ where: { id: item.id } });
            if (!dbItem) continue;

            totalAmount += dbItem.price * item.quantity;
            orderItemsData.push({
                menuItemId: dbItem.id,
                quantity: item.quantity,
                price: dbItem.price,
            });
        }

        // Add 5% tax
        const tax = Math.round(totalAmount * 0.05);
        totalAmount = totalAmount + tax;

        // Add parcel charges if applicable
        if (type === 'PARCEL') {
            totalAmount += 10;
        }

        const order = await prisma.order.create({
            data: {
                customerName,
                mobileNumber,
                tableNumber,
                type: type || 'DINE_IN',
                specialNote,
                totalAmount,
                status: "PENDING",
                items: {
                    create: orderItemsData,
                },
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
    }
}
