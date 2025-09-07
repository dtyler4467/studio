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
import { Logo } from '@/components/icons/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to LogiFlow</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardContent>
        <div className="mt-4 text-center text-sm p-6 pt-0">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
