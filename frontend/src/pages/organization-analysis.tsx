import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components/layout';
import { OrganizationAnalysisForm } from '@/components/organization-analysis-form';
import { useRouter } from 'next/router';

export default function OrganizationAnalysisPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // Verificar autenticação
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <OrganizationAnalysisForm />
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
