
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const features = [
    { title: "Real-Time Tracking", description: "Monitors employee clock-ins and clock-outs in real-time to ensure accurate payment and attendance records." },
    { title: "Biometric Authentication", description: "Utilizes fingerprints or facial recognition to prevent buddy punching and ensure only authorized personnel clock in/out." },
    { title: "Multiple Time Entry Options", description: "Provides options for clocking in, such as mobile apps, web-based access, or physical time clocks." },
    { title: "Automatic Break Tracking", description: "Automatically calculates and tracks breaks, reducing the chances of errors in payroll." },
    { title: "Reporting and Analytics", description: "Generates reports on hours worked, attendance trends, and overtime, aiding in payroll and workforce analysis." },
    { title: "Integration Capabilities", description: "Easily integrates with payroll systems, HR software, and project management tools for seamless data flow." },
    { title: "GPS Tracking", description: "For remote or field employees, GPS tracking ensures accurate location verification when clocking in/out." },
    { title: "Employee Self-Service Portal", description: "Allows employees to view their timesheets, request time off, and update personal information, improving transparency." },
    { title: "Alerts and Notifications", description: "Sends alerts for missed punches, overtime, or approaching break times to keep employees informed." },
    { title: "Compliance Management", description: "Ensures adherence to labor laws and regulations, including tracking overtime and time-off requests." },
    { title: "User-Friendly Interface", description: "Offers an intuitive design for both employees and management to facilitate ease of use and reduce training time." },
];


export default function TimeClockSettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Time Clock Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Time Clock System Features</CardTitle>
                <CardDescription>
                    An overview of features for an efficient and accurate time clock system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <CheckCircle className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
