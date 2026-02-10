"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

interface MenuItemProps {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isAvailable: boolean;
}

export function MenuItemCard({ item }: { item: MenuItemProps }) {
    const { addItem, removeItem, items, updateQuantity } = useCart();
    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
        });
    };

    const handleIncrement = () => {
        if (cartItem) {
            updateQuantity(item.id, cartItem.quantity + 1);
        } else {
            handleAdd();
        }
    };

    const handleDecrement = () => {
        if (cartItem && cartItem.quantity > 0) {
            updateQuantity(item.id, cartItem.quantity - 1);
        }
    };

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-lg border-border/60",
            !item.isAvailable && "opacity-60 grayscale pointer-events-none"
        )}>
            <div className="aspect-[4/3] bg-muted/50 relative group overflow-hidden">
                {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-primary/5">
                        <ShoppingBag className="w-12 h-12 text-primary/20" />
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm font-semibold">Sold Out</Badge>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">{item.name}</h3>
                    <span className="font-bold text-primary whitespace-nowrap">₹{item.price}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 pb-4 h-15">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {item.description || "Freshly prepared with love."}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                {quantity > 0 ? (
                    <div className="flex items-center justify-between w-full bg-secondary/30 rounded-full dark:bg-secondary/20 p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background shadow-sm hover:bg-background hover:text-primary transition-colors"
                            onClick={handleDecrement}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center tabular-nums">{quantity}</span>
                        <Button
                            variant="default" // Use primary color for +
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-sm hover:opacity-90 transition-opacity"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-4 w-4 text-primary-foreground" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="w-full rounded-full font-medium"
                        variant="outline"
                        onClick={handleAdd}
                        disabled={!item.isAvailable}
                    >
                        Add to Order
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
