import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/icons/logo';
import { Camera, FileUp } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Complete the steps below to register with LogiFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">History</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
                 <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-confirm">Confirm Password</Label>
                  <Input id="password-confirm" type="password" />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="role">Role</Label>
                   <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clerk">Clerk</SelectItem>
                      <SelectItem value="dispatch">Dispatch</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="owner-op">Owner Operator</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="employment" className="mt-6">
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Please provide up to ten years of employment history.</p>
                    </div>
                    <Textarea placeholder="Detail your employment history here..." rows={10} />
                </div>
            </TabsContent>
            <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                        <Camera className="w-12 h-12 text-muted-foreground" />
                        <p className="text-sm font-semibold">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">Take or upload a clear headshot.</p>
                        <Button variant="outline">Take Picture</Button>
                    </div>
                     <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                        <FileUp className="w-12 h-12 text-muted-foreground" />
                        <p className="text-sm font-semibold">Upload Documents</p>
                        <p className="text-xs text-muted-foreground">Upload your driver's license, certifications, etc.</p>
                        <Button variant="outline">Upload Files</Button>
                    </div>
                </div>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="w-full mt-6">
            Create Account
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
