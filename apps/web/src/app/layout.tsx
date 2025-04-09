import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import Loading from './loading';
import ClientParticles from '@/components/ClientParticles';

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full relative`}>
        <div className="fixed inset-0 -z-10">
          <ClientParticles />
        </div>
        <div className="relative z-10">
          <Suspense fallback={<Loading />}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
