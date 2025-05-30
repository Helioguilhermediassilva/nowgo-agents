import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout';
import Head from 'next/head';

export default function AnalysisResultsPage() {
  const t = useTranslations('AnalysisResults');
  const { theme } = useTheme();
  const router = useRouter();
  
  // Simulação de dados de análise
  const analysisData = {
    organizationName: "NowGo Holding",
    industry: "technology",
    size: "medium",
    recommendedAgents: [
      {
        id: "virginia",
        name: "Virginia",
        type: "customer_support",
        confidence: 98,
        description: t('agents.virginia.description'),
        benefits: [
          t('agents.virginia.benefits.1'),
          t('agents.virginia.benefits.2'),
          t('agents.virginia.benefits.3')
        ]
      },
      {
        id: "guilherme",
        name: "Guilherme",
        type: "sales",
        confidence: 95,
        description: t('agents.guilherme.description'),
        benefits: [
          t('agents.guilherme.benefits.1'),
          t('agents.guilherme.benefits.2'),
          t('agents.guilherme.benefits.3')
        ]
      }
    ],
    channels: {
      whatsapp: true,
      email: true,
      phone: true,
      linkedin: true
    },
    languages: {
      portuguese: true,
      english: true,
      spanish: true
    },
    integrations: {
      crm: true
    }
  };
  
  const handleDeployAgents = () => {
    // Simulação de implantação dos agentes
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };
  
  return (
    <>
      <Head>
        <title>{t('pageTitle')} | NowGo Agents</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle', { organization: analysisData.organizationName })}</p>
          </div>
          <Button onClick={() => router.push('/organization-analysis')}>
            {t('newAnalysis')}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('summary.title')}</CardTitle>
            <CardDescription>{t('summary.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('summary.organization')}</p>
                <p>{analysisData.organizationName}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {t(`summary.industry.${analysisData.industry}`)}
                  </Badge>
                  <Badge variant="outline">
                    {t(`summary.size.${analysisData.size}`)}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('summary.channels')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysisData.channels).map(([channel, enabled]) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <p className="text-sm">{t(`summary.channels.${channel}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('summary.languages')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysisData.languages).map(([language, enabled]) => (
                    <div key={language} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <p className="text-sm">{t(`summary.languages.${language}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('recommendedAgents.title')}</h2>
          <p className="text-muted-foreground">{t('recommendedAgents.description')}</p>
          
          <Tabs defaultValue={analysisData.recommendedAgents[0].id} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              {analysisData.recommendedAgents.map(agent => (
                <TabsTrigger key={agent.id} value={agent.id}>
                  {agent.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {analysisData.recommendedAgents.map(agent => (
              <TabsContent key={agent.id} value={agent.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{agent.name}</CardTitle>
                        <CardDescription>{t(`agents.types.${agent.type}`)}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        {t('recommendedAgents.confidence', { value: agent.confidence })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">{t('recommendedAgents.description')}</h3>
                      <p>{agent.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t('recommendedAgents.benefits')}</h3>
                      <ul className="space-y-2">
                        {agent.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{t('recommendedAgents.compatibility')}</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">{t('recommendedAgents.channelCompatibility')}</p>
                            <p className="text-sm font-medium">92%</p>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">{t('recommendedAgents.languageCompatibility')}</p>
                            <p className="text-sm font-medium">100%</p>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">{t('recommendedAgents.integrationCompatibility')}</p>
                            <p className="text-sm font-medium">95%</p>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('deployment.title')}</CardTitle>
            <CardDescription>{t('deployment.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">{t('deployment.notice.title')}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{t('deployment.notice.description')}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{t('deployment.estimatedTime.title')}</h3>
                  <p>{t('deployment.estimatedTime.description')}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">{t('deployment.nextSteps.title')}</h3>
                  <p>{t('deployment.nextSteps.description')}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/organization-analysis')}>
              {t('deployment.buttons.back')}
            </Button>
            <Button onClick={handleDeployAgents}>
              {t('deployment.buttons.deploy')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

// Usa o layout padrão para a página de resultados de análise
AnalysisResultsPage.getLayout = (page) => <Layout>{page}</Layout>;
