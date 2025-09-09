
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, DollarSign, PlusCircle, FileDown, ArrowDown, ArrowUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BudgetCategory = {
    id: string;
    name: string;
    budgeted: number;
    spent: number;
};

type Transaction = {
    id: string;
    date: Date;
    description: string;
    category: string;
    amount: number;
}

const initialBudgetData: BudgetCategory[] = [
    { id: 'ops', name: 'Operations', budgeted: 50000, spent: 45000 },
    { id: 'fuel', name: 'Fuel', budgeted: 80000, spent: 82500 },
    { id: 'maintenance', name: 'Maintenance', budgeted: 35000, spent: 30000 },
    { id: 'salaries', name: 'Salaries', budgeted: 120000, spent: 120000 },
    { id: 'marketing', name: 'Marketing', budgeted: 15000, spent: 10000 },
];

const initialTransactions: Transaction[] = [
    { id: 'TRN001', date: new Date(), description: 'Fuel for Truck #12', category: 'Fuel', amount: 350.25 },
    { id: 'TRN002', date: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'Tire replacement for TR53123', category: 'Maintenance', amount: 850.00 },
    { id: 'TRN003', date: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Facebook Ad Campaign', category: 'Marketing', amount: 500.00 },
];

function AddBudgetItemDialog({ onAdd }: { onAdd: (item: Omit<BudgetCategory, 'id' | 'spent'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [budgeted, setBudgeted] = useState("");
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !budgeted) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.'});
            return;
        }
        onAdd({ name, budgeted: parseFloat(budgeted) });
        setIsOpen(false);
        setName("");
        setBudgeted("");
        toast({ title: 'Budget Item Added', description: `${name} has been added to the budget.`});
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2" /> Add Budget Item</Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Add New Budget Item</DialogTitle>
                    <DialogDescription>
                        Define a new category and set a budget amount for it.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Category Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="budgeted" className="text-right">Budgeted Amount</Label>
                        <Input id="budgeted" type="number" value={budgeted} onChange={e => setBudgeted(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function LogExpenseDialog({ categories, onAdd }: { categories: BudgetCategory[], onAdd: (expense: Omit<Transaction, 'id' | 'date'>) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const { toast } = useToast();
    
    const handleSave = () => {
        if (!description || !category || !amount) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.'});
            return;
        }
        onAdd({ description, category, amount: parseFloat(amount) });
        setIsOpen(false);
        setDescription("");
        setCategory("");
        setAmount("");
        toast({ title: 'Expense Logged', description: `An expense of $${amount} has been logged.`});
    };

     return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" /> Log Expense</Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Log New Expense</DialogTitle>
                    <DialogDescription>
                        Record a new transaction against a budget category.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                         <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Log Expense</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState(initialBudgetData);
  const [transactions, setTransactions] = useState(initialTransactions);

  const handleAddBudgetItem = (item: Omit<BudgetCategory, 'id' | 'spent'>) => {
      const newItem: BudgetCategory = { ...item, id: item.name.toLowerCase().replace(' ', '-'), spent: 0 };
      setBudgetData(prev => [...prev, newItem]);
  };

  const handleLogExpense = (expense: Omit<Transaction, 'id' | 'date'>) => {
      const newTransaction: Transaction = { ...expense, id: `TRN${Date.now()}`, date: new Date() };
      setTransactions(prev => [newTransaction, ...prev]);
      setBudgetData(prev => prev.map(cat => 
          cat.name === expense.category 
          ? { ...cat, spent: cat.spent + expense.amount }
          : cat
      ));
  };
  
  const totalBudget = budgetData.reduce((acc, item) => acc + item.budgeted, 0);
  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const variance = totalSpent - totalBudget;

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Budgeting" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Budget Overview</h2>
            <div className="flex items-center gap-2">
                <LogExpenseDialog categories={budgetData} onAdd={handleLogExpense} />
                <AddBudgetItemDialog onAdd={handleAddBudgetItem} />
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                     <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", remainingBudget < 0 ? "text-destructive" : "text-green-600")}>${remainingBudget.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Variance</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", variance > 0 ? "text-destructive" : "text-green-600")}>
                        {variance > 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Budget vs. Actuals</CardTitle>
                    <CardDescription>A visual comparison of budgeted amounts vs. actual spending.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[350px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={budgetData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" width={100}/>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="budgeted" fill="hsl(var(--muted))" radius={4} name="Budgeted" />
                                <Bar dataKey="spent" fill="hsl(var(--primary))" radius={4} name="Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Recent Transactions</CardTitle>
                     <CardDescription>A log of the most recent expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.slice(0, 5).map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <p className="font-medium">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{tx.category} - {format(tx.date, 'PPP')}</p>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${tx.amount.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Budget Breakdown</CardTitle>
                <CardDescription>A detailed list of all budget categories.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Budgeted</TableHead>
                            <TableHead className="text-right">Spent</TableHead>
                            <TableHead className="text-right">Remaining</TableHead>
                            <TableHead className="w-[200px]">Overage/Underage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {budgetData.map(item => {
                            const remaining = item.budgeted - item.spent;
                            const overUnder = (item.spent / item.budgeted) * 100;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">${item.budgeted.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${item.spent.toLocaleString()}</TableCell>
                                    <TableCell className={cn("text-right font-semibold", remaining < 0 ? "text-destructive" : "text-green-600")}>
                                        ${remaining.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                             <Progress value={Math.min(overUnder, 100)} className={cn(overUnder > 100 && "[&>div]:bg-destructive")}/>
                                             <span className="text-xs text-muted-foreground w-12 text-right">{overUnder.toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
