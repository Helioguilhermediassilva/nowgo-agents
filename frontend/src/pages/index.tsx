import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Layout } from '@/components/layout';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('Home');
  const { theme } = useTheme();
  
  return (
    <>
      <Head>
        <title>NowGo Agents | {t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      
      <div className="flex flex-col items-center justify-center space-y-12 text-center py-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/organization-analysis">
                {t('hero.primaryButton')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                {t('hero.secondaryButton')}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-5xl">
          <img 
            src="/images/dashboard-preview.png" 
            alt="NowGo Agents Dashboard" 
            className="w-full rounded-lg border shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = theme === 'dark' 
                ? '/images/dashboard-placeholder-dark.svg' 
                : '/images/dashboard-placeholder-light.svg';
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>{t('features.analysis.title')}</CardTitle>
              <CardDescription>{t('features.analysis.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center rounded-md bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/organization-analysis">
                  {t('features.analysis.button')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('features.agents.title')}</CardTitle>
              <CardDescription>{t('features.agents.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center rounded-md bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/dashboard/agents">
                  {t('features.agents.button')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('features.channels.title')}</CardTitle>
              <CardDescription>{t('features.channels.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center rounded-md bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" x2="8" y1="13" y2="13"></line>
                  <line x1="16" x2="8" y1="17" y2="17"></line>
                  <line x1="10" x2="8" y1="9" y2="9"></line>
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/dashboard/integrations">
                  {t('features.channels.button')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tighter">{t('cta.title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('cta.description')}
          </p>
          <Button size="lg" asChild>
            <Link href="/organization-analysis">
              {t('cta.button')}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

// Usa o layout padrão para a página inicial
HomePage.getLayout = (page) => <Layout>{page}</Layout>;
