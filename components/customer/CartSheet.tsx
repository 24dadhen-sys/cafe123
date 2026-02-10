"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Trash2, ChevronRight, CheckCircle2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // Assume this exists or I'll use div
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/store";
import { toast } from "sonner"; // For notifications

export function CartSheet() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    // Client-side calculation to ensure hydration match
    const cartTotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    const itemCount = items.length;

    const handlePlaceOrder = () => {
        setIsOrdering(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Order Placed Successfully!", {
                description: "Kitchen has been notified. We will serve you shortly!",
            });
            clearCart();
            setIsOpen(false);
            setIsOrdering(false);
        }, 1500);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button size="icon" className="relative rounded-full h-12 w-12 shadow-lg hover:scale-105 transition-transform">
                    <ShoppingCart className="h-6 w-6" />
                    {items.reduce((a, b) => a + b.quantity, 0) > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in">
                            {items.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" /> Your Order
                    </SheetTitle>
                    <SheetDescription>
                        Review your items before placing the order.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-auto py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
                            <ShoppingCart className="h-16 w-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <Button variant="link" onClick={() => setIsOpen(false)}>
                                Go back to menu
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-1">
                                    {/* Image placeholder or small thumbnail if available */}
                                    <div className="h-16 w-16 rounded-md bg-muted/50 flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                                        IMG
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between">
                                            <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center border rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-6 text-center text-xs">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive ml-auto"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="flex-col gap-4 sm:flex-col border-t pt-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-base font-medium">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Taxes (5%)</span>
                                <span>₹{Math.round(cartTotal * 0.05)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-bold text-primary">
                                <span>Total</span>
                                <span>₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                            </div>
                        </div>
                        <Button
                            className="w-full h-12 text-lg shadow-md"
                            onClick={handlePlaceOrder}
                            disabled={isOrdering}
                        >
                            {isOrdering ? "Placing Order..." : (
                                <span className="flex items-center gap-2">
                                    Place Order <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
