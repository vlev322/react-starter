import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-grow">
          <AppSidebar />
          <main className="flex-grow p-4">
            <SidebarTrigger />
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
        <footer className="bg-sky-200 p-4 text-center">
          <p>&copy; 2024 Your App Name</p>
        </footer>
      </div>
    </SidebarProvider>
  );
}
