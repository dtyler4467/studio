import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const alerts = [
  {
    name: 'Admin',
    avatar: 'AD',
    title: 'System Maintenance',
    description: 'Scheduled maintenance on Saturday at 10 PM PST.',
  },
  {
    name: 'Dispatch',
    avatar: 'DI',
    title: 'Route 80 Closed',
    description: 'Major accident on I-80 East, expect delays.',
  },
  {
    name: 'HR',
    avatar: 'HR',
    title: 'Open Enrollment',
    description: 'Benefits open enrollment ends this Friday.',
  },
  {
    name: 'Procurement',
    avatar: 'PR',
    title: 'Part #345 Delayed',
    description: 'Supplier reports a 2-day delay on part #345.',
  },
];

export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Alerts</CardTitle>
        <CardDescription>Key alerts and announcements from the team.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback>{alert.avatar}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{alert.title}</p>
              <p className="text-sm text-muted-foreground">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
