import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import Loading from './loading';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Football Scout",
  description: "AI-powered football scouting platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className={`${inter.className} min-h-full relative bg-gray-900`}>
        <Suspense fallback={<Loading />}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
