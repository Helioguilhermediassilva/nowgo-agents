import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components/layout';
import { AgentDashboard } from '@/components/agent-dashboard';
import { useRouter } from 'next/router';

export default function DashboardPage() {
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
      <AgentDashboard />
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
