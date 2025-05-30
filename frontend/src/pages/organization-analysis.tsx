import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Layout } from '@/components/layout';
import { OrganizationAnalysisForm } from '@/components/organization-analysis-form';
import Head from 'next/head';

export default function OrganizationAnalysisPage() {
  const t = useTranslations('OrganizationAnalysis');
  
  return (
    <>
      <Head>
        <title>{t('pageTitle')} | NowGo Agents</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      <OrganizationAnalysisForm />
    </>
  );
}

// Usa o layout padrão para a página de análise organizacional
OrganizationAnalysisPage.getLayout = (page) => <Layout>{page}</Layout>;
