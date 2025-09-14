
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const benefitItems = [
    { title: "Medical Insurance", content: "Comprehensive medical, dental, and vision plans are available to all full-time employees after 90 days of employment." },
    { title: "401(K) Retirement Plan", content: "We offer a competitive 401(K) plan with a company match of up to 4% after one year of service." },
    { title: "Paid Time Off (PTO)", content: "Employees accrue PTO based on years of service. Please see the full handbook for the detailed accrual schedule." },
];

const policyItems = [
    { title: "Code of Conduct", content: "All employees are expected to maintain a professional and respectful workplace environment." },
    { title: "Work from Home Policy", content: "Eligible employees may work from home with manager approval. A secure internet connection and a dedicated workspace are required." },
    { title: "Safety Policy", content: "Safety is our top priority. All employees must adhere to safety guidelines and report any incidents immediately." },
];

export default function HrPoliciesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Company Policies" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Company Policies & Benefits</CardTitle>
                <CardDescription>
                    Review key company policies, the employee handbook, and benefits information.
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
                     <Accordion type="single" collapsible className="w-full">
                        {benefitItems.map((item, index) => (
                             <AccordionItem value={`benefit-${index}`} key={index}>
                                <AccordionTrigger>{item.title}</AccordionTrigger>
                                <AccordionContent>{item.content}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                
                 <div>
                    <h3 className="text-xl font-semibold mb-4">Key Policies</h3>
                     <Accordion type="single" collapsible className="w-full">
                        {policyItems.map((item, index) => (
                             <AccordionItem value={`policy-${index}`} key={index}>
                                <AccordionTrigger>{item.title}</AccordionTrigger>
                                <AccordionContent>{item.content}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
