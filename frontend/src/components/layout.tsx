import React from 'react';
import { useTranslation } from 'next-i18next';
import { MainNavigation } from '@/components/main-navigation';
import { Footer } from '@/components/footer';

export function Layout({ children }) {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
