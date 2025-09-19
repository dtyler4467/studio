
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  category: 'Apparel' | 'Equipment' | 'Accessories' | 'Office';
  price: number;
  imageUrl: string;
  dataAiHint: string;
};

const initialProducts: Product[] = [
  { id: 'prod_001', name: 'LogiFlow Trucker Hat', category: 'Apparel', price: 24.99, imageUrl: 'https://picsum.photos/seed/hat/400/400', dataAiHint: 'trucker hat' },
  { id: 'prod_002', name: 'Heavy-Duty Ratchet Straps (4-Pack)', category: 'Equipment', price: 49.99, imageUrl: 'https://picsum.photos/seed/straps/400/400', dataAiHint: 'ratchet straps' },
  { id: 'prod_003', name: 'Branded Travel Mug', category: 'Accessories', price: 19.99, imageUrl: 'https://picsum.photos/seed/mug/400/400', dataAiHint: 'travel mug' },
  { id: 'prod_004', name: 'LogiFlow Polo Shirt', category: 'Apparel', price: 39.99, imageUrl: 'https://picsum.photos/seed/shirt/400/400', dataAiHint: 'polo shirt' },
  { id: 'prod_005', name: 'Safety Vest', category: 'Equipment', price: 29.99, imageUrl: 'https://picsum.photos/seed/vest/400/400', dataAiHint: 'safety vest' },
  { id: 'prod_006', name: 'Ergonomic Desk Chair', category: 'Office', price: 299.99, imageUrl: 'https://picsum.photos/seed/chair/400/400', dataAiHint: 'office chair' },
];

function AddItemDialog({ onSave }: { onSave: (product: Omit<Product, 'id'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Product['category']>('Accessories');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !category || !price || !imageUrl) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields and upload an image.' });
            return;
        }
        onSave({
            name,
            category,
            price: parseFloat(price),
            imageUrl,
            dataAiHint: 'custom product'
        });
        setIsOpen(false);
        // Reset form
        setName('');
        setCategory('Accessories');
        setPrice('');
        setImageUrl(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> Add New Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Store Item</DialogTitle>
                    <DialogDescription>Fill out the details for the new product.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select value={category} onValueChange={(value: Product['category']) => setCategory(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Apparel">Apparel</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Accessories">Accessories</SelectItem>
                                <SelectItem value="Office">Office</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Image</Label>
                        <div className="col-span-3">
                            <DocumentUpload onDocumentChange={setImageUrl} currentDocument={imageUrl} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function StorePage() {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const { toast } = useToast();

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchQuery, categoryFilter]);

    const handleAddItem = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: `prod_${Date.now()}`,
        };
        setProducts(prev => [newProduct, ...prev]);
        toast({ title: 'Item Added', description: `${productData.name} has been added to the store.` });
    };

    const handleAddToCart = (product: Product) => {
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your shopping cart.`,
        });
    };

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Products" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="font-headline flex items-center gap-2">
                                    <ShoppingCart />
                                    Company Merchandise &amp; Equipment
                                </CardTitle>
                                <CardDescription>
                                    Browse and purchase company-branded gear and essential equipment.
                                </CardDescription>
                            </div>
                            <div className="flex-shrink-0">
                                <AddItemDialog onSave={handleAddItem} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Apparel">Apparel</SelectItem>
                                    <SelectItem value="Equipment">Equipment</SelectItem>
                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                    <SelectItem value="Office">Office</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden flex flex-col">
                                    <div className="relative w-full aspect-square">
                                        <Image 
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            style={{objectFit: 'cover'}}
                                            data-ai-hint={product.dataAiHint}
                                        />
                                    </div>
                                    <CardHeader className="flex-1">
                                        <CardTitle className="text-base">{product.name}</CardTitle>
                                        <CardDescription>{product.category}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between items-center">
                                        <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                                        <Button size="sm" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="h-64 flex items-center justify-center border-dashed border-2 rounded-lg">
                                <p className="text-muted-foreground">No products found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

    