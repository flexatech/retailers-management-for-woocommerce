import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

import Header from './components/layout/Header';

export default function AppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Toaster />
        <Outlet />
      </main>
    </div>
  );
}
