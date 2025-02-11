'use client';
import { useTransition } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { login } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema, type SignInFormSchemaType } from '@/lib/schemas/sign-in';
import { DEFAULT_ADMIN_REDIRECT, DEFAULT_USER_REDIRECT } from '@/routes';

export function Login() {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <SignInForm />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"></div>
    </div>
  );
}

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  // 1. define form
  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });
  // 2. define a submit handler
  async function onSubmit(data: SignInFormSchemaType) {
    // do something with the form data
    // data here is type-safe and validated
    startTransition(async () => {
      const { ok, message, user } = await login(data);
      if (ok && user) {
        // do something with the user
        const role = user.role;
        if (role === 'ADMIN') {
          redirect(DEFAULT_ADMIN_REDIRECT);
        } else {
          redirect(DEFAULT_USER_REDIRECT);
        }
      } else {
        // show an error message
        console.error(message);
        form.setError('root.serverError', { type: 'custom', message });
      }
    });
  }
  const isFormValid = form.formState.isValid;
  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="flex flex-col p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormDescription>This is your public username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.serverError.type === 'custom' && (
              <div>
                <p className="text-destructive text-sm">
                  {form.formState.errors.root?.serverError.message}
                </p>
                <Button size="sm" variant="outline" onClick={() => form.reset()}>
                  reset
                </Button>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={!isFormValid || isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
