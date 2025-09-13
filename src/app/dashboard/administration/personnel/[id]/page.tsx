

"use client";

import { useSchedule, Employee } from "@/hooks/use-schedule";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, User, Shield, FileText, Image as ImageIcon, MapPin } from "lucide-react";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);

export default function PersonnelDetailPage() {
  const { getEmployeeById, updateEmployeeDocument, getEmployeeDocument } = useSchedule();
  const params = useParams();
  const { id } = params;
  const [employee, setEmployee] = useState<Employee | null | undefined>(undefined);
  const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
        const foundEmployee = getEmployeeById(id);
        setEmployee(foundEmployee);
        if (foundEmployee) {
            const doc = getEmployeeDocument(foundEmployee.id);
            setDocumentDataUri(doc);
        }
    }
  }, [id, getEmployeeById, getEmployeeDocument]);

  const handleDocumentChange = (dataUri: string | null) => {
    if (employee) {
        updateEmployeeDocument(employee.id, dataUri);
        setDocumentDataUri(dataUri);
    }
  };

  if (employee === undefined) {
    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Loading Personnel Details..." />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (employee === null) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle={`Personnel File: ${employee.name}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-3xl">{employee.name}</CardTitle>
                        <CardDescription>
                            Viewing the complete file for {employee.name}.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Role Information</CardTitle>
                            </CardHeader>
                             <CardContent className="grid md:grid-cols-2 gap-6 text-base">
                                <DetailItem icon={User} label="Personnel ID" value={employee.personnelId} />
                                <DetailItem icon={Shield} label="Role" value={employee.role} />
                                <DetailItem icon={Mail} label="Email Address" value={employee.email} />
                                <DetailItem icon={Phone} label="Phone Number" value={employee.phoneNumber} />
                                 <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Work Location</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {employee.workLocation && employee.workLocation.length > 0 ? 
                                                employee.workLocation.map(loc => <Badge key={loc}>{loc}</Badge>) : 
                                                <p className="font-medium">N/A</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="documents" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personnel Documents</CardTitle>
                                <CardDescription>Manage and view documents associated with this employee.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <DocumentUpload onDocumentChange={handleDocumentChange} currentDocument={documentDataUri} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="activity" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Activity</CardTitle>
                                <CardDescription>A log of actions this user has taken within the system.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                                    <p className="text-muted-foreground">Activity log coming soon.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

    
