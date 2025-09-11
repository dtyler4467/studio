
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useSchedule, BolTemplate } from '@/hooks/use-schedule';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileText, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function BolTemplatesPage() {
    const { bolTemplates, deleteBolTemplate } = useSchedule();
    const router = useRouter();

    const handleUseTemplate = (template: BolTemplate) => {
        // Use sessionStorage to pass complex object to avoid long URLs
        sessionStorage.setItem(`bolTemplate_${template.id}`, JSON.stringify(template));
        router.push(`/dashboard/warehouse-hub-manager/bol?templateId=${template.id}`);
    }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="BOL Templates" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">BOL Templates</CardTitle>
                <CardDescription>
                    Manage and create reusable Bill of Lading templates. Select a template to use it.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {bolTemplates.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Template Name</TableHead>
                                    <TableHead>Shipper</TableHead>
                                    <TableHead>Consignee</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bolTemplates.map(template => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {template.name}
                                        </TableCell>
                                        <TableCell>{template.shipper.name}</TableCell>
                                        <TableCell>{template.consignee.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" onClick={() => handleUseTemplate(template)}>Use Template</Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => deleteBolTemplate(template.id)}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                     <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                        <p className="text-muted-foreground">No BOL templates created yet. Save one from the BOL creation page.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
