import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Suspense } from 'react';
import Loading from './loading';
import ThemeToggle from '@/components/ThemeToggle';
import ClientParticles from '@/components/ClientParticles';

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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} transition-colors duration-200`}>
        <ThemeProvider>
          <Suspense fallback={<Loading />}>
            <div className="relative min-h-screen">
              <ClientParticles />
              <AuthProvider>{children}</AuthProvider>
            </div>
          </Suspense>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
