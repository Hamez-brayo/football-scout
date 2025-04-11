'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {children}
      </div>
    </div>
  );
} 