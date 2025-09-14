
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-xl font-semibold font-headline">{title}</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">{children}</div>
    </div>
);

export default function AdminTermsAndAgreementsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // In a real app, this would come from a database or CMS
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Terms & Agreements" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Terms of Service for Logiflow</CardTitle>
                <CardDescription>
                    {lastUpdated ? `Last Updated: ${lastUpdated}. Please review these terms carefully.` : 'Loading...'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="space-y-6">
                         <p>Welcome to Logiflow! By using our mobile application, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

                        <Section title="1. Acceptance of Terms">
                            <p>
                               By accessing or using the Logiflow application, you accept these Terms of Service and agree to be bound by them.
                            </p>
                        </Section>

                        <Section title="2. Changes to Terms">
                            <p>
                                Logiflow reserves the right to modify these terms at any time. Changes will be posted in the application, and your continued use of the app after such changes constitutes your acceptance of the new terms.
                            </p>
                        </Section>

                        <Section title="3. User Accounts">
                            <p>
                               You may need to create an account to access certain features. You agree to provide accurate, current, and complete information and to update such information to keep it accurate, current, and complete.
                            </p>
                        </Section>

                        <Section title="4. Privacy Policy">
                            <p>
                                Your use of Logiflow is also governed by our Privacy Policy, which can be found [here]. Your acceptance of these terms signifies your agreement to the Privacy Policy.
                            </p>
                        </Section>

                        <Section title="5. User Responsibilities">
                            <ul className="list-disc pl-5">
                                <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                                <li>You agree not to use the app for any unlawful purpose.</li>
                                <li>You agree not to engage in any behavior that could harm the app or its users.</li>
                            </ul>
                        </Section>

                        <Section title="6. Intellectual Property">
                            <p>
                                All content, trademarks, and other intellectual property used in the Logiflow application are the property of Logiflow or its licensors. You may not reproduce, distribute, or create derivative works without our express permission.
                            </p>
                        </Section>

                        <Section title="7. Termination">
                            <p>
                                Logiflow reserves the right to suspend or terminate your access to the app at any time, without notice, for conduct that we believe violates these terms or is harmful to other users or the app.
                            </p>
                        </Section>

                        <Section title="8. Disclaimers">
                            <p>
                                Logiflow is provided on an "as-is" basis. We do not warrant that the app will be free from errors or that it will be available at all times.
                            </p>
                        </Section>

                        <Section title="9. Limitation of Liability">
                            <p>
                                To the fullest extent permitted by law, Logiflow shall not be liable for any damages arising from your use or inability to use the app, even if we have been advised of the possibility of such damages.
                            </p>
                        </Section>

                         <Section title="10. Governing Law">
                            <p>
                                These terms shall be governed by and construed in accordance with the laws of [Your Location]. Any disputes arising in connection with these terms shall be resolved in the courts of [Your Location].
                            </p>
                        </Section>

                        <Section title="11. Contact Information">
                            <p>
                                For any questions regarding these Terms of Service, please contact us at [Your Email Address].
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
