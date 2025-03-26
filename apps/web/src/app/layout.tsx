import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import Loading from './loading';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Football Scout",
  description: "Your AI-powered football scouting assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} transition-colors duration-200`}>
        <Suspense fallback={<Loading />}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
