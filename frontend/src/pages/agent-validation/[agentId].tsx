import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/layout";
import { useTranslation } from 'next-i18next';

// Hook personalizado para validação de agentes
import { useAgentValidation } from '@/hooks/useAgentValidation';

const AgentValidationPage = () => {
  const router = useRouter();
  const { agentId } = router.query;
  const { t } = useTranslation('common');
  const { toast } = useToast();
  
  // Estados para controle da interface
  const [activeTab, setActiveTab] = useState('overview');
  const [feedback, setFeedback] = useState('');
  const [modifications, setModifications] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  
  // Utilizar o hook personalizado para validação de agentes
  const { 
    agent, 
    isLoading, 
    error, 
    validateAgent,
    isValidating
  } = useAgentValidation(agentId);
  
  // Efeito para notificar erros
  useEffect(() => {
    if (error) {
      toast({
        title: t('error'),
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast, t]);
  
  // Função para lidar com a aprovação ou rejeição do agente
  const handleValidation = async () => {
    try {
      await validateAgent({
        agentId: Number(agentId),
        approved: isApproved,
        feedback,
        modifications: Object.keys(modifications).length > 0 ? modifications : undefined
      });
      
      toast({
        title: isApproved ? t('agent_approved') : t('agent_rejected'),
        description: isApproved 
          ? t('agent_approved_description') 
          : t('agent_rejected_description'),
        variant: isApproved ? 'default' : 'secondary',
      });
      
      // Redirecionar para o dashboard após validação
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      toast({
        title: t('validation_error'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  
  // Função para atualizar modificações no prompt
  const handlePromptChange = (value) => {
    setModifications({
      ...modifications,
      prompt: value
    });
  };
  
  // Função para atualizar modificações no nome
  const handleNameChange = (value) => {
    setModifications({
      ...modifications,
      name: value
    });
  };
  
  // Função para atualizar modificações na descrição
  const handleDescriptionChange = (value) => {
    setModifications({
      ...modifications,
      description: value
    });
  };
  
  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">{t('loading_agent_data')}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Renderizar quando o agente não for encontrado
  if (!agent && !isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>{t('agent_not_found')}</CardTitle>
              <CardDescription>{t('agent_not_found_description')}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard')}>{t('back_to_dashboard')}</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('validate_agent')}</h1>
            <p className="text-muted-foreground">{t('validate_agent_description')}</p>
          </div>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            {t('back_to_dashboard')}
          </Button>
        </div>
        
        {agent && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </div>
                  <Badge variant={agent.type === 'customer_support' ? 'default' : 'secondary'}>
                    {agent.type === 'customer_support' ? t('customer_support') : 
                     agent.type === 'sales' ? t('sales') : 
                     agent.type === 'marketing' ? t('marketing') : 
                     agent.type === 'finance' ? t('finance') : 
                     agent.type === 'hr' ? t('hr') : agent.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                    <TabsTrigger value="configuration">{t('configuration')}</TabsTrigger>
                    <TabsTrigger value="channels">{t('channels')}</TabsTrigger>
                    <TabsTrigger value="feedback">{t('feedback')}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{t('agent_name')}</h3>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          defaultValue={agent.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">{t('agent_description')}</h3>
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border rounded-md min-h-[100px]"
                          defaultValue={agent.description}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">{t('agent_type')}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {agent.type === 'customer_support' ? t('customer_support_description') : 
                         agent.type === 'sales' ? t('sales_description') : 
                         agent.type === 'marketing' ? t('marketing_description') : 
                         agent.type === 'finance' ? t('finance_description') : 
                         agent.type === 'hr' ? t('hr_description') : ''}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">{t('agent_model')}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {agent.configuration.model}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="configuration" className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{t('agent_prompt')}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('agent_prompt_description')}
                      </p>
                      <Textarea
                        className="min-h-[300px] font-mono text-sm"
                        defaultValue={agent.configuration.prompt}
                        onChange={(e) => handlePromptChange(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="channels" className="p-6">
                  <div className="grid gap-6">
                    {agent.configuration.channels && Object.entries(agent.configuration.channels).map(([channel, config]) => (
                      <div key={channel} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium capitalize">{channel}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t(`${channel}_description`)}
                            </p>
                          </div>
                          <Switch
                            checked={config.enabled}
                            disabled
                          />
                        </div>
                        
                        {config.configuration && (
                          <div className="mt-4 grid gap-2">
                            {Object.entries(config.configuration).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-3 gap-4 items-center">
                                <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    className="w-full p-2 border rounded-md"
                                    defaultValue={value}
                                    disabled
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {(!agent.configuration.channels || Object.keys(agent.configuration.channels).length === 0) && (
                      <div className="text-center py-6 text-muted-foreground">
                        {t('no_channels_configured')}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="feedback" className="p-6">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-medium">{t('validation_decision')}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id="approval"
                          checked={isApproved}
                          onCheckedChange={setIsApproved}
                        />
                        <Label htmlFor="approval">
                          {isApproved ? t('approve_agent') : t('reject_agent')}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isApproved ? t('approve_agent_description') : t('reject_agent_description')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">{t('feedback')}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('feedback_description')}
                      </p>
                      <Textarea
                        placeholder={t('feedback_placeholder')}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleValidation}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      {t('processing')}
                    </>
                  ) : (
                    isApproved ? t('approve_and_deploy') : t('reject_agent')
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AgentValidationPage;

// Configuração para i18n
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

// Configuração para geração de páginas estáticas
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
