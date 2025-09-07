import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AiAlertsForm } from '@/components/dashboard/ai-alerts-form';

export default function AlertsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="AI-Powered Alerts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Proactive Disruption Monitoring</CardTitle>
            <CardDescription>
              Leverage AI to scan for weather, traffic, news, and political events that could impact your supply chain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiAlertsForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
