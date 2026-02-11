
"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

interface MenuItemProps {
    item: {
        id: string;
        name: string;
        price: number;
        description?: string | null;
        imageUrl?: string | null;
    };
}

export function MenuItem({ item }: MenuItemProps) {
    const { items, addItem, removeItem, updateQuantity } = useCart();
    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    };

    const handleIncrement = () => {
        updateQuantity(item.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(item.id, quantity - 1);
        } else {
            removeItem(item.id);
        }
    };

    return (
        <div className="flex justify-between items-start p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm font-medium text-gray-900 mt-1">₹{item.price}</p>
                {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
            </div>
            <div className="flex flex-col items-center gap-2">
                {item.imageUrl && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                )}
                {quantity === 0 ? (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50 uppercase font-bold px-6"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                ) : (
                    <div className="flex items-center bg-orange-50 rounded-lg p-1 border border-orange-200">
                        <button
                            onClick={handleDecrement}
                            className="p-1 hover:bg-orange-100 rounded text-orange-700"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-2 text-sm font-bold text-orange-700 w-4 text-center">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="p-1 hover:bg-orange-100 rounded text-orange-700"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
