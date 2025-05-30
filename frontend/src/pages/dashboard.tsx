import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Layout } from '@/components/layout';
import { AgentDashboard } from '@/components/agent-dashboard';
import Head from 'next/head';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  
  return (
    <>
      <Head>
        <title>{t('pageTitle')} | NowGo Agents</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      <AgentDashboard />
    </>
  );
}

// Usa o layout padrão para a página de dashboard
DashboardPage.getLayout = (page) => <Layout>{page}</Layout>;
