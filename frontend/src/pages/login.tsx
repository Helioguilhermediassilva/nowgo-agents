import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Layout } from '@/components/layout';
import { AuthForm } from '@/components/auth-form';
import Head from 'next/head';

export default function LoginPage() {
  const t = useTranslations('Auth');
  
  return (
    <>
      <Head>
        <title>{t('login.pageTitle')} | NowGo Agents</title>
        <meta name="description" content={t('login.pageDescription')} />
      </Head>
      <AuthForm mode="login" />
    </>
  );
}

// Desabilita o layout padrão para a página de login
LoginPage.getLayout = (page) => page;
