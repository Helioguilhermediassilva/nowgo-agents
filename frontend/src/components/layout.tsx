import React from 'react';
import { useTranslations } from 'next-intl';
import { MainNavigation } from '@/components/main-navigation';
import { Footer } from '@/components/footer';

export function Layout({ children }) {
  const t = useTranslations('Layout');

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      <main className="flex-1 container py-6 md:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
