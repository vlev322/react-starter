import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-sky-200 p-4">
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/" className="text-blue-600 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profiles" className="text-blue-600 hover:underline">
                  Profiles
                </Link>
              </li>
            </ul>
          </nav>
        </header>
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
