import React from 'react';
import { useTranslation } from 'next-i18next';

export function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} NowGo Holding. {t('allRightsReserved')}
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="/terms" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t('terms')}
          </a>
          <a 
            href="/privacy" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t('privacy')}
          </a>
          <a 
            href="https://github.com/NowGoHolding/nowgo-agents" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
