
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SosAlertForm } from '@/components/dashboard/sos-alert-form';
import { SosAlertHistory } from '@/components/dashboard/sos-alert-history';
import { Separator } from '@/components/ui/separator';

export default function SosAlertsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="SOS Alerts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6">
            <SosAlertForm />
            <Separator />
            <SosAlertHistory />
        </div>
      </main>
    </div>
  );
}
