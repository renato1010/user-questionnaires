'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
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

export function Login() {
  const searchParams = useSearchParams();

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
  // 1. define form
  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });
  // 2. define a submit handler
  function onSubmit(data: SignInFormSchemaType) {
    // do something with the form data
    // data here is type-safe and validated
    console.log({ data });
  }

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
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display username.</FormDescription>
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
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <div className="text-muted-foreground text-[0.8rem]">
                    Password Requirements:
                    <ul className="list-disc list-inside">
                      <li>Must be at least 8 characters long</li>
                      <li>
                        Must include at least:
                        <ul className="list-disc list-inside ml-2">
                          <li>1 lowercase letter (a-z)</li>
                          <li>1 uppercase letter (A-Z)</li>
                          <li>1 number (0-9)</li>
                          <li>
                            1 special character:{' '}
                            {decodeURIComponent(encodeURIComponent(`-._!"\`'#%&,:...etc`))}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
