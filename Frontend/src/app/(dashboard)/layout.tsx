"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine role based on URL path
  let role = 'STUDENT';
  if (pathname?.startsWith('/lecturer')) role = 'LECTURER';
  if (pathname?.startsWith('/admin')) role = 'ADMIN';

  // Extract page name simply based on the last segment or path name
  let pageName = 'Dashboard';
  if (pathname?.includes('/courses')) pageName = 'My Courses';
  if (pathname?.includes('/assignments')) pageName = 'Assignments';
  if (pathname?.includes('/leaderboard')) pageName = 'Leaderboard';
  if (pathname?.includes('/badges')) pageName = 'Badges Gallery';
  if (pathname?.includes('/users')) pageName = 'User Management';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <TopNav pageName={pageName} role={role} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
