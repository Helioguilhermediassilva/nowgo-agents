import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components/layout';
import { useRouter } from 'next/router';

// Componentes UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">NowGo Agents Platform</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Plataforma multi-tenant para geração automática de agentes autônomos personalizados para qualquer empresa
          </p>
          <div className="flex gap-4 mt-8">
            <Button size="lg" onClick={() => router.push('/login')}>
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/about')}>
              Saiba Mais
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Análise Organizacional</CardTitle>
              <CardDescription>
                Entenda as necessidades específicas da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nossa plataforma analisa o perfil da sua organização para recomendar os agentes mais adequados para suas necessidades específicas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => router.push('/login')}>
                Iniciar Análise
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geração Automática</CardTitle>
              <CardDescription>
                Crie agentes personalizados com um clique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Após a análise, nosso sistema gera automaticamente agentes personalizados para atender às necessidades específicas da sua empresa.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => router.push('/login')}>
                Gerar Agentes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integração Multi-Canal</CardTitle>
              <CardDescription>
                Conecte seus agentes a múltiplos canais de comunicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Integre seus agentes com WhatsApp, Email, Telefone, LinkedIn e outros canais para uma experiência omnichannel completa.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => router.push('/login')}>
                Configurar Integrações
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-medium mb-2">Análise</h3>
              <p className="text-muted-foreground">Preencha o perfil da sua organização para análise personalizada</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-medium mb-2">Recomendação</h3>
              <p className="text-muted-foreground">Receba recomendações de agentes específicos para suas necessidades</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-medium mb-2">Geração</h3>
              <p className="text-muted-foreground">Gere automaticamente os agentes selecionados com um clique</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-xl font-medium mb-2">Integração</h3>
              <p className="text-muted-foreground">Configure integrações com seus canais e sistemas existentes</p>
            </div>
          </div>
        </div>

        <div className="bg-muted p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie sua conta agora e comece a construir seu time de agentes autônomos em minutos.
            </p>
          </div>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => router.push('/login')}>
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </div>
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
