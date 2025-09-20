"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, PlusCircle, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';


type FinancialData = {
    currentAssets: number;
    currentLiabilities: number;
    inventory: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    netIncome: number;
    revenue: number;
    interestExpense: number;
};

type RatioResult = {
    value: number;
    status: 'Healthy' | 'Moderate' | 'Poor' | 'N/A';
};

const getRatioStatus = (value: number, healthyRange: [number, number], moderateRange: [number, number]): RatioResult['status'] => {
    if (isNaN(value) || !isFinite(value)) return 'N/A';
    if (value >= healthyRange[0] && value <= healthyRange[1]) return 'Healthy';
    if (value >= moderateRange[0] && value <= moderateRange[1]) return 'Moderate';
    return 'Poor';
};

const RatioCard = ({ title, description, value, status, formula }: { title: string; description: string; value: number | string; status: RatioResult['status']; formula: string }) => {
    const statusVariant = {
        'Healthy': 'bg-green-600',
        'Moderate': 'bg-yellow-500',
        'Poor': 'bg-destructive',
        'N/A': 'bg-muted-foreground',
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">{description}</p>
                                <p className="mt-2 font-mono text-xs bg-muted p-1 rounded">Formula: {formula}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{typeof value === 'number' ? value.toFixed(2) : value}</div>
            </CardContent>
            <CardFooter>
                 <Badge className={cn("text-white", statusVariant[status])}>{status}</Badge>
            </CardFooter>
        </Card>
    );
};

export default function FinancialRatiosPage() {
    const { toast } = useToast();
    const [data, setData] = useState<FinancialData>({
        currentAssets: 110000,
        currentLiabilities: 35000,
        inventory: 35000,
        totalAssets: 335000,
        totalLiabilities: 135000,
        totalEquity: 200000,
        netIncome: 57000,
        revenue: 365000,
        interestExpense: 8000,
    });
    
    const handleDataChange = (key: keyof FinancialData, value: string) => {
        setData(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const ratios = useMemo(() => {
        const { currentAssets, currentLiabilities, inventory, totalAssets, totalLiabilities, totalEquity, netIncome, revenue } = data;
        const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
        const quickRatio = currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0;
        const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
        const debtToAsset = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
        const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
        const returnOnAssets = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
        const returnOnEquity = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;
        const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;

        return {
            liquidity: [
                { title: 'Current Ratio', value: currentRatio, status: getRatioStatus(currentRatio, [2, Infinity], [1, 1.99]), formula: 'Current Assets / Current Liabilities', description: "Measures a company's ability to pay short-term obligations." },
                { title: 'Quick Ratio', value: quickRatio, status: getRatioStatus(quickRatio, [1, Infinity], [0.8, 0.99]), formula: '(Current Assets - Inventory) / Current Liabilities', description: "Also known as the acid-test ratio, it measures ability to pay current liabilities without relying on inventory." },
            ],
            profitability: [
                { title: 'Net Profit Margin', value: netProfitMargin, status: getRatioStatus(netProfitMargin, [20, Infinity], [10, 19.99]), formula: '(Net Income / Revenue) * 100', description: "Indicates how much profit a company makes for every dollar of revenue." },
                { title: 'Return on Assets (ROA)', value: returnOnAssets, status: getRatioStatus(returnOnAssets, [20, Infinity], [5, 19.99]), formula: '(Net Income / Total Assets) * 100', description: "Shows how efficiently a company is using its assets to generate profit." },
                { title: 'Return on Equity (ROE)', value: returnOnEquity, status: getRatioStatus(returnOnEquity, [15, Infinity], [10, 14.99]), formula: '(Net Income / Total Equity) * 100', description: "Measures the rate of return on the ownership interest (shareholders' equity) of a company." },
            ],
            leverage: [
                { title: 'Debt-to-Equity Ratio', value: debtToEquity, status: getRatioStatus(debtToEquity, [0, 1], [1.01, 2]), formula: 'Total Liabilities / Total Equity', description: "Indicates the proportion of equity and debt used to finance a company's assets." },
                { title: 'Debt-to-Asset Ratio', value: debtToAsset, status: getRatioStatus(debtToAsset, [0, 0.4], [0.41, 0.6]), formula: 'Total Liabilities / Total Assets', description: "Measures the extent to which a company's assets are financed by debt." },
            ],
            efficiency: [
                { title: 'Asset Turnover Ratio', value: assetTurnover, status: getRatioStatus(assetTurnover, [2, Infinity], [1, 1.99]), formula: 'Revenue / Total Assets', description: "Measures the efficiency of a company's use of its assets in generating sales revenue." },
            ]
        };
    }, [data]);
    
    const DataInput = ({ id, label, value }: { id: keyof FinancialData, label: string, value: number }) => (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-xs">{label}</Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                 <Input 
                    id={id}
                    type="number" 
                    value={value || ''} 
                    onChange={(e) => handleDataChange(id, e.target.value)} 
                    className="pl-7"
                 />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Financial Ratio Analysis" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Calculator />
                                Data Inputs
                            </CardTitle>
                            <CardDescription>Enter your financial data here to calculate the ratios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                            <h4 className="font-semibold text-sm text-primary">Balance Sheet Data</h4>
                            <DataInput id="currentAssets" label="Current Assets" value={data.currentAssets} />
                            <DataInput id="currentLiabilities" label="Current Liabilities" value={data.currentLiabilities} />
                            <DataInput id="inventory" label="Inventory" value={data.inventory} />
                            <DataInput id="totalAssets" label="Total Assets" value={data.totalAssets} />
                            <DataInput id="totalLiabilities" label="Total Liabilities" value={data.totalLiabilities} />
                            <DataInput id="totalEquity" label="Total Equity" value={data.totalEquity} />
                             <Separator className="my-4" />
                            <h4 className="font-semibold text-sm text-primary">Income Statement Data</h4>
                            <DataInput id="revenue" label="Revenue" value={data.revenue} />
                            <DataInput id="netIncome" label="Net Income" value={data.netIncome} />
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-3 space-y-6">
                        <div>
                             <h3 className="text-xl font-semibold font-headline mb-4">Liquidity Ratios</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                {ratios.liquidity.map(r => <RatioCard key={r.title} {...r} value={r.value.toFixed(2)} />)}
                            </div>
                        </div>
                        <div>
                             <h3 className="text-xl font-semibold font-headline mb-4">Profitability Ratios</h3>
                             <div className="grid md:grid-cols-3 gap-4">
                                {ratios.profitability.map(r => <RatioCard key={r.title} {...r} value={`${r.value.toFixed(2)}%`} />)}
                            </div>
                        </div>
                         <div>
                             <h3 className="text-xl font-semibold font-headline mb-4">Leverage Ratios</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                {ratios.leverage.map(r => <RatioCard key={r.title} {...r} value={r.value.toFixed(2)} />)}
                            </div>
                        </div>
                         <div>
                             <h3 className="text-xl font-semibold font-headline mb-4">Efficiency Ratios</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                {ratios.efficiency.map(r => <RatioCard key={r.title} {...r} value={r.value.toFixed(2)} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

