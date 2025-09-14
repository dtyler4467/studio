
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { Pencil } from 'lucide-react';
import Image from 'next/image';

type PolicyItem = {
    title: string;
    content: string;
    documentUri?: string | null;
};

const initialBenefitItems: PolicyItem[] = [
    { title: "Medical Insurance", content: "Comprehensive medical, dental, and vision plans are available to all full-time employees after 90 days of employment." },
    { title: "401(K) Retirement Plan", content: "We offer a competitive 401(K) plan with a company match of up to 4% after one year of service." },
    { title: "Paid Time Off (PTO)", content: "Employees accrue PTO based on years of service. Please see the full handbook for the detailed accrual schedule." },
];

const initialPolicyItems: PolicyItem[] = [
    { title: "Code of Conduct", content: "All employees are expected to maintain a professional and respectful workplace environment." },
    { title: "Work from Home Policy", content: "Eligible employees may work from home with manager approval. A secure internet connection and a dedicated workspace are required." },
    { title: "Safety Policy", content: "Safety is our top priority. All employees must adhere to safety guidelines and report any incidents immediately." },
];

const EditPolicyDialog = ({
    item,
    isOpen,
    onOpenChange,
    onSave,
}: {
    item: PolicyItem | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (documentUri: string | null) => void;
}) => {
    const [documentUri, setDocumentUri] = useState<string | null>(item?.documentUri || null);

    if (!item) return null;

    const handleSave = () => {
        onSave(documentUri);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Document for: {item.title}</DialogTitle>
                    <DialogDescription>
                        Upload or capture the document for this policy.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <DocumentUpload onDocumentChange={setDocumentUri} currentDocument={documentUri} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Document</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function HrPoliciesPage() {
  const [benefitItems, setBenefitItems] = useState<PolicyItem[]>(initialBenefitItems);
  const [policyItems, setPolicyItems] = useState<PolicyItem[]>(initialPolicyItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PolicyItem | null>(null);
  const [selectedType, setSelectedType] = useState<'benefit' | 'policy' | null>(null);

  const handleEditClick = (item: PolicyItem, type: 'benefit' | 'policy') => {
      setSelectedItem(item);
      setSelectedType(type);
      setIsDialogOpen(true);
  };

  const handleSaveDocument = (documentUri: string | null) => {
    if (selectedItem && selectedType) {
        if (selectedType === 'benefit') {
            setBenefitItems(prev => prev.map(item => item.title === selectedItem.title ? {...item, documentUri} : item));
        } else {
            setPolicyItems(prev => prev.map(item => item.title === selectedItem.title ? {...item, documentUri} : item));
        }
    }
  };

  const renderAccordion = (items: PolicyItem[], type: 'benefit' | 'policy') => (
    <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
            <AccordionItem value={`${type}-${index}`} key={index}>
                <AccordionTrigger onClick={() => handleEditClick(item, type)} className="hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                        <span>{item.title}</span>
                        <Pencil className="h-4 w-4 text-muted-foreground mr-2" />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    {item.documentUri ? (
                        <div className="relative h-96">
                            <Image src={item.documentUri} alt={item.title} layout="fill" objectFit="contain" />
                        </div>
                    ) : (
                        <p>{item.content}</p>
                    )}
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  );

  return (
    <>
    <div className="flex flex-col w-full">
      <Header pageTitle="Company Policies" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Company Policies & Benefits</CardTitle>
                <CardDescription>
                    Review key company policies, the employee handbook, and benefits information. Click a policy to attach a document.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Employee Handbook</h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground p-4 border rounded-md">
                        <p>Our employee handbook contains all the detailed information about company policies, procedures, and expectations. Please review it carefully.</p>
                        <p>A full downloadable version will be available here.</p>
                    </div>
                </div>

                 <div>
                    <h3 className="text-xl font-semibold mb-4">Benefits Overview</h3>
                    {renderAccordion(benefitItems, 'benefit')}
                </div>
                
                 <div>
                    <h3 className="text-xl font-semibold mb-4">Key Policies</h3>
                    {renderAccordion(policyItems, 'policy')}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
     <EditPolicyDialog 
        item={selectedItem}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveDocument}
     />
    </>
  );
}
