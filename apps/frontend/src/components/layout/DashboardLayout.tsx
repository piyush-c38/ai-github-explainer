import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-on-surface">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
