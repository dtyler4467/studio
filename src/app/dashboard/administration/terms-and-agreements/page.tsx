
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-xl font-semibold font-headline">{title}</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">{children}</div>
    </div>
);

export default function AdminTermsAndAgreementsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Terms & Agreements" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">LogiFlow Application Terms of Service</CardTitle>
                <CardDescription>
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Please review these terms carefully.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="space-y-6">
                        <Section title="1. Introduction">
                            <p>
                                Welcome to LogiFlow ("the Application"), a software solution provided by [Your Company Name] ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our mobile application and associated services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
                            </p>
                        </Section>

                        <Section title="2. License Grant">
                            <p>
                                Subject to your compliance with these Terms and payment of all applicable fees, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to use the Service for your internal business operations during the term of your subscription.
                            </p>
                        </Section>

                        <Section title="3. Fees and Payment">
                            <p>
                                Access to the Service requires payment of subscription fees as set forth on our pricing page or in your specific agreement with us. All fees are due in advance and are non-refundable, except as required by law. We reserve the right to change our fees upon 30 days' notice. Failure to pay fees may result in suspension or termination of your access to the Service.
                            </p>
                        </Section>

                        <Section title="4. User Accounts and Responsibilities">
                            <p>
                                You are responsible for all activity that occurs under your account, including the activity of your authorized users. You agree to: (a) maintain the security of your account credentials; (b) provide accurate and current account information; and (c) be responsible for the conduct of your users and their compliance with these Terms.
                            </p>
                        </Section>

                        <Section title="5. Intellectual Property">
                            <p>
                                We own all right, title, and interest in and to the Service, including all related intellectual property rights. The look and feel of the Service, including all custom graphics, icons, and scripts, is the service mark, trademark, and/or trade dress of the Company and may not be copied, imitated, or used, in whole or in part, without our prior written permission.
                            </p>
                        </Section>

                        <Section title="6. Restrictions on Use">
                            <p>
                                You agree not to, and not to permit your users to: (a) reverse engineer, decompile, or otherwise attempt to discover the source code of the Service; (b) modify, translate, or create derivative works based on the Service; (c) rent, lease, loan, resell, or otherwise commercially exploit the Service; or (d) use the Service for any illegal or unauthorized purpose.
                            </p>
                        </Section>

                        <Section title="7. Termination">
                            <p>
                                We may terminate or suspend your access to the Service at any time, with or without cause or notice, for any reason. Upon termination, your right to use the Service will immediately cease. You may terminate your subscription at the end of your billing cycle by providing notice in accordance with the cancellation procedures.
                            </p>
                        </Section>

                        <Section title="8. Disclaimer of Warranties">
                            <p>
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                            </p>
                        </Section>

                        <Section title="9. Limitation of Liability">
                            <p>
                                IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
                            </p>
                        </Section>

                         <Section title="10. Indemnification">
                            <p>
                                You agree to defend, indemnify, and hold harmless the Company, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your use of and access to the Service.
                            </p>
                        </Section>

                        <Section title="11. Governing Law">
                            <p>
                                These Terms shall be governed by the laws of the State of [Your State], without respect to its conflict of laws principles.
                            </p>
                        </Section>

                         <Section title="12. Changes to Terms">
                            <p>
                                We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of these Terms. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                            </p>
                        </Section>

                        <Section title="13. Contact Information">
                            <p>
                                If you have any questions about these Terms, please contact us at [Your Contact Email/Address].
                            </p>
                        </Section>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
