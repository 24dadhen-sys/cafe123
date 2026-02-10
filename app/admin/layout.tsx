"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, LayoutDashboard, UtensilsCrossed, Receipt, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/admin/sales", label: "Sales", icon: Receipt },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r bg-card">
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-6 py-6 border-b">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Sippin&apos;s Cafe</h1>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t">
                        <Link href="/">
                            <Button variant="outline" className="w-full justify-start gap-3">
                                <LogOut className="h-5 w-5" />
                                Exit Admin
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="md:pl-64">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Coffee className="h-6 w-6 text-primary" />
                            <span className="font-bold">Admin Panel</span>
                        </div>
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Nav */}
                    <div className="flex gap-1 px-2 pb-2 overflow-x-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "gap-2 whitespace-nowrap",
                                            isActive && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
