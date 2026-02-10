"use client";

import { useState, useEffect } from "react";
import { Coffee, TrendingUp, Calendar, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: string;
    createdAt: string;
    tableNumber?: string | null;
    totalAmount: number;
    status: string;
    type: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        menuItem: {
            name: string;
        };
    }[];
}

export default function AdminSalesPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        ordersToday: 0,
        totalOrders: 0,
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);

            // Calculate stats
            const totalRevenue = data.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
            const today = new Date().toDateString();
            const ordersToday = data.filter((order: Order) =>
                new Date(order.createdAt).toDateString() === today
            ).length;

            setStats({
                totalRevenue,
                ordersToday,
                totalOrders: data.length,
            });
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Coffee className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Sales Management</h1>
                <p className="text-muted-foreground mt-1">View order history and revenue analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ordersToday}</div>
                        <p className="text-xs text-muted-foreground mt-1">Received today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Table</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No orders yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                                    <TableCell>{order.tableNumber || "N/A"}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="text-muted-foreground">
                                                    {item.quantity}x {item.menuItem.name}
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{order.items.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">₹{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "COMPLETED" ? "default" :
                                                    order.status === "PREPARING" ? "secondary" :
                                                        "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
