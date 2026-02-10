import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.menuItem.deleteMany({});
    await prisma.category.deleteMany({});

    const menuData = [
        {
            category: "TEA",
            items: [
                { name: "Classic Chai", price: 35 },
                { name: "Masala Chai", price: 40 },
                { name: "Lemon Tea", price: 30 },
                { name: "Kulhad Tea", price: 35 },
                { name: "Elaichi Tea", price: 30 },
                { name: "Chocolate Tea", price: 40 },
                { name: "Green Tea", price: 25 },
            ]
        },
        {
            category: "HOT COFFEE",
            items: [
                { name: "Classic Hot S/M/L", price: 60, description: "Small: 60, Medium: 80, Large: 100" },
                { name: "Black Coffee", price: 65 },
                { name: "French Vanilla", price: 90 },
                { name: "Hazelnut", price: 100 },
                { name: "Butter Scotch", price: 105 },
                { name: "Mocha", price: 110 },
            ]
        },
        {
            category: "COLD COFFEE",
            items: [
                { name: "Classic Cold Coffee", price: 80 },
                { name: "Vanilla Frappe", price: 105 },
                { name: "Hazelnut Frappe", price: 135 },
                { name: "Butter Scotch Frappe", price: 110 },
                { name: "Mocha Frappe", price: 110 },
                { name: "Classic with Brownie", price: 105 },
                { name: "Classic with Ice Cream", price: 100 },
            ]
        },
        {
            category: "BREADS & BUN",
            items: [
                { name: "Bun Maska", price: 45 },
                { name: "Bread Jam Toast", price: 45 },
                { name: "Garlic Bread", price: 85 },
                { name: "Bread Pizza", price: 75 },
                { name: "Roasted Bun Maska", price: 45 },
                { name: "Nutella Bun", price: 60 },
            ]
        },
        {
            category: "SNACKS",
            items: [
                { name: "Cheese Maggi", price: 70 },
                { name: "Korean Maggi", price: 85 },
                { name: "Chicken Nuggets", price: 110 },
                { name: "Cheese Nuggets", price: 99 },
                { name: "Salted Fries", price: 75 },
                { name: "Veggie Loaded Fries", price: 125 },
                { name: "Chicken Loaded Fries", price: 140 },
                { name: "Baked Fries", price: 110 },
                { name: "Chilly Potato", price: 140 },
            ]
        },
        {
            category: "PUFF",
            items: [
                { name: "Veg Puff", price: 35 },
                { name: "Veggie Loaded Puff", price: 55 },
                { name: "Paneer Puff", price: 65 },
                { name: "Special Puff", price: 59 },
                { name: "Cheese Loaded Puff", price: 69 },
            ]
        },
        {
            category: "NACHOS",
            items: [
                { name: "Classic Cheesy", price: 89 },
                { name: "Hot Salsa", price: 105 },
                { name: "Peri Peri", price: 99 },
                { name: "Tandoori", price: 105 },
                { name: "Mexican Loaded", price: 110 },
                { name: "Chulling Chips", price: 89 },
            ]
        },
        {
            category: "PASTA",
            items: [
                { name: "Alfredo", price: 140 },
                { name: "Arrabiata", price: 120 },
                { name: "Pink Sauce", price: 150 },
                { name: "Peri Peri", price: 130 },
                { name: "Creamy Mushrooms", price: 150 },
            ]
        },
        {
            category: "DESSERT",
            items: [
                { name: "Brownie", price: 99 },
                { name: "Dark Brownie", price: 110 },
                { name: "Choco Brownie Taco", price: 160 },
                { name: "Chocolate Strawberry", price: 175 },
                { name: "Chocolate Pancake", price: 99 },
            ]
        },
        {
            category: "RAMEN",
            items: [
                { name: "Classic Soy - Paneer/Egg/Chicken", price: 185, description: "Choose protein" },
                { name: "Spicy Korean", price: 189 },
                { name: "Cheesy Creamy", price: 209 },
            ]
        },
        {
            category: "WAFFLE",
            items: [
                { name: "Classic Chocolate", price: 125 },
                { name: "Salted Caramel", price: 135 },
                { name: "Strawberry Crush", price: 140 },
                { name: "Oreo Crumble", price: 99 },
                { name: "Nutella Delight", price: 140 },
                { name: "Strawberry Loaded", price: 125 },
            ]
        },
        {
            category: "HOT CHOCOLATE",
            items: [
                { name: "Classic Hot", price: 99 },
                { name: "Dark Hot", price: 110 },
                { name: "Cinnamon Hot", price: 140 },
            ]
        },
        {
            category: "FULL MEAL SPECIAL",
            items: [
                { name: "Dal Bati", price: 99 },
                { name: "Chole Chawal", price: 129, description: "Parcel charges 10/-" },
            ]
        }
    ]

    for (const section of menuData) {
        const category = await prisma.category.upsert({
            where: { name: section.category },
            update: {},
            create: { name: section.category },
        })

        for (const item of section.items) {
            await prisma.menuItem.create({
                data: {
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    categoryId: category.id,
                },
            })
        }
    }

    // Seed Store Config
    const configs = [
        { key: "cafeName", value: "Sippin's Cafe" },
        { key: "logoUrl", value: "/logo.png" },
        { key: "parcelCharges", value: "10" },
        { key: "gstEnabled", value: "true" },
        { key: "gstPercentage", value: "5" },
    ]

    for (const config of configs) {
        await prisma.storeConfig.upsert({
            where: { key: config.key },
            update: {},
            create: { key: config.key, value: config.value },
        })
    }

    console.log('✅ Seed data inserted successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
