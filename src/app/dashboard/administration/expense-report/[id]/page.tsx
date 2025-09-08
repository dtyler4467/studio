
"use client";

import { useSchedule, ExpenseReport } from "@/hooks/use-schedule";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const DetailItem = ({ label, value, isCurrency = false }: { label: string, value: string | number | undefined, isCurrency?: boolean }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">
            {isCurrency && typeof value === 'number' ? `$${value.toFixed(2)}` : (value || 'N/A')}
        </p>
    </div>
);

export default function ExpenseReportDocumentPage() {
  const { getExpenseReportById } = useSchedule();
  const params = useParams();
  const { id } = params;
  const [report, setReport] = useState<ExpenseReport | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id === 'string') {
        const foundReport = getExpenseReportById(id);
        setReport(foundReport);
    }
  }, [id, getExpenseReportById]);

  if (report === undefined) {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Loading Expense Report..." />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                             </div>
                             <div>
                                <Skeleton className="w-full h-96" />
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (report === null) {
    notFound();
  }

  const statusVariant = {
    "Pending": "secondary",
    "Approved": "default",
    "Denied": "destructive"
  }[report.status] as "secondary" | "default" | "destructive";

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle={`Expense Report: ${report.id}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Expense Details</CardTitle>
                        <CardDescription>
                            Viewing details for expense report <span className="font-semibold">{report.id}</span> submitted by <span className="font-semibold">{report.employeeName}</span>.
                        </CardDescription>
                    </div>
                    <Badge variant={statusVariant} className={cn('capitalize text-base', report.status === 'Approved' && 'bg-green-600')}>{report.status}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Report Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                <DetailItem label="Report ID" value={report.id} />
                                <DetailItem label="Submission Date" value={format(new Date(report.date), 'PPP')} />
                                <DetailItem label="Employee" value={report.employeeName} />
                                <DetailItem label="Category" value={report.category} />
                                <DetailItem label="Amount" value={report.amount} isCurrency />
                                <DetailItem label="Status" value={report.status} />
                                <div className="col-span-2">
                                     <DetailItem label="Description" value={report.description} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Attached Document</h3>
                        <div className="border rounded-md p-2 bg-muted h-[600px] flex items-center justify-center">
                            {report.documentDataUri ? (
                                <Image
                                    src={report.documentDataUri}
                                    alt="Attached document"
                                    width={800}
                                    height={1100}
                                    className="object-contain max-h-full max-w-full rounded-md"
                                />
                            ) : (
                                <Alert variant="default" className="max-w-sm mx-auto">
                                    <FileQuestion className="h-4 w-4" />
                                    <AlertTitle>No Document Attached</AlertTitle>
                                    <AlertDescription>
                                        There was no document uploaded for this expense.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
