import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components/layout';
import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <AuthForm />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
