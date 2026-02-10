"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    isAvailable: boolean;
    category: {
        id: string;
        name: string;
    };
}

interface Category {
    id: string;
    name: string;
}

export default function AdminMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        isAvailable: true,
    });

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            toast.error("Failed to load menu items");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
        };

        try {
            const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(editingItem ? "Item updated!" : "Item added!");
                setDialogOpen(false);
                resetForm();
                fetchMenu();
            } else {
                toast.error("Failed to save item");
            }
        } catch (error) {
            toast.error("Error saving item");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this item?")) return;

        try {
            const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Item deleted");
                fetchMenu();
            }
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            description: "",
            categoryId: "",
            isAvailable: true,
        });
        setEditingItem(null);
    };

    const openEditDialog = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price.toString(),
            description: item.description || "",
            categoryId: item.category.id,
            isAvailable: item.isAvailable,
        });
        setDialogOpen(true);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Menu Management</h1>
                    <p className="text-muted-foreground mt-1">Add, edit, or remove items from your menu</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit" : "Add"} Menu Item</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the menu item
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="available"
                                    checked={formData.isAvailable}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                                />
                                <Label htmlFor="available">Available for order</Label>
                            </div>

                            <DialogFooter>
                                <Button type="submit">{editingItem ? "Update" : "Add"} Item</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No items found. Add your first item!
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.category.name}</TableCell>
                                    <TableCell className="font-medium">₹{item.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                            {item.isAvailable ? "Available" : "Sold Out"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(item)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
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
