import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] flex flex-col justify-between">
      <main className={`${className}`}>
        {children}
      </main>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#f4f4fc] text-sm text-center py-6 border-t w-full mt-auto">
      <div className="text-[#1e1e2f] font-semibold mb-1">Event buddy.</div>
      <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-xs">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Sign in</a>
        <a href="#" className="hover:underline">Sign up</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div>
      <p className="mt-2 text-gray-400">© 2025 Event buddy. All rights reserved.</p>
    </footer>
  );
} 