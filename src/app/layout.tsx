import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getUser } from '@/lib/auth/queries';
import { UserProvider } from '@/lib/auth/user-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'User Questionnaires',
  description: `Demo that allows users to answer questions and administrators
to view all the answers provided by users.
`
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userPromise = getUser();
  return (
    <html lang="en">
      <body className={`h-dvh w-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
