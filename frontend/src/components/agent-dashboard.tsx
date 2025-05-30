import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/router';
import { useAgents } from '@/hooks/useAgents';

export function AgentDashboard() {
  const t = useTranslations('AgentDashboard');
  const { theme } = useTheme();
  const router = useRouter();
  const { agents, isLoading, error } = useAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-muted-foreground">{t('error')}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }

  const virginiaAgent = agents.find(agent => agent.name === 'Virginia');
  const guilhermeAgent = agents.find(agent => agent.name === 'Guilherme');

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={() => router.push('/dashboard/new-agent')}>
          {t('newAgent')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cartão de métricas gerais */}
        <Card>
          <CardHeader>
            <CardTitle>{t('metrics.title')}</CardTitle>
            <CardDescription>{t('metrics.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('metrics.totalInteractions')}</p>
                <p className="text-2xl font-bold">1,248</p>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  +12.5%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('metrics.satisfactionRate')}</p>
                <p className="text-2xl font-bold">94.7%</p>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  +2.3%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('metrics.leadsGenerated')}</p>
                <p className="text-2xl font-bold">87</p>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  +15.8%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('metrics.salesCompleted')}</p>
                <p className="text-2xl font-bold">32</p>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  +8.2%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartão de status dos agentes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('status.title')}</CardTitle>
            <CardDescription>{t('status.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-green-500">
                    <AvatarImage src="/images/virginia-avatar.png" alt="Virginia" />
                    <AvatarFallback>VA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Virginia</p>
                    <p className="text-sm text-muted-foreground">{t('status.customerSupport')}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {t('status.online')}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-green-500">
                    <AvatarImage src="/images/guilherme-avatar.png" alt="Guilherme" />
                    <AvatarFallback>GU</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Guilherme</p>
                    <p className="text-sm text-muted-foreground">{t('status.salesAgent')}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {t('status.online')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="virginia" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="virginia">{t('agents.virginia.name')}</TabsTrigger>
          <TabsTrigger value="guilherme">{t('agents.guilherme.name')}</TabsTrigger>
        </TabsList>

        <TabsContent value="virginia" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src="/images/virginia-avatar.png" alt="Virginia" />
                  <AvatarFallback>VA</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{t('agents.virginia.name')}</CardTitle>
                  <CardDescription>{t('agents.virginia.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t('agents.performance')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.responseTime')}</p>
                      <p className="text-sm font-medium">28s</p>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.resolutionRate')}</p>
                      <p className="text-sm font-medium">92%</p>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.customerSatisfaction')}</p>
                      <p className="text-sm font-medium">96%</p>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{t('agents.channels')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">WhatsApp</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">Email</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.channels.phone')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <p className="text-sm">LinkedIn</p>
                    </div>
                  </div>

                  <h3 className="font-medium mt-6">{t('agents.languages')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.portuguese')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.english')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.spanish')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => router.push(`/dashboard/agents/virginia/edit`)}>
                  {t('agents.actions.edit')}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/dashboard/agents/virginia/conversations`)}>
                  {t('agents.actions.viewConversations')}
                </Button>
                <Button onClick={() => router.push(`/dashboard/agents/virginia/analytics`)}>
                  {t('agents.actions.analytics')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guilherme" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src="/images/guilherme-avatar.png" alt="Guilherme" />
                  <AvatarFallback>GU</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{t('agents.guilherme.name')}</CardTitle>
                  <CardDescription>{t('agents.guilherme.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t('agents.performance')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.leadsGenerated')}</p>
                      <p className="text-sm font-medium">87</p>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.meetingsScheduled')}</p>
                      <p className="text-sm font-medium">42</p>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{t('agents.metrics.salesCompleted')}</p>
                      <p className="text-sm font-medium">32</p>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{t('agents.channels')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <p className="text-sm">WhatsApp</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">Email</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.channels.phone')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">LinkedIn</p>
                    </div>
                  </div>

                  <h3 className="font-medium mt-6">{t('agents.languages')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.portuguese')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.english')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm">{t('agents.languages.spanish')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => router.push(`/dashboard/agents/guilherme/edit`)}>
                  {t('agents.actions.edit')}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/dashboard/agents/guilherme/conversations`)}>
                  {t('agents.actions.viewConversations')}
                </Button>
                <Button onClick={() => router.push(`/dashboard/agents/guilherme/analytics`)}>
                  {t('agents.actions.analytics')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
