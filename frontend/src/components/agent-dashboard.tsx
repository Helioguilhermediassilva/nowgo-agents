import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function AgentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("agents");

  // Buscar agentes gerados
  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/agents');
      return response.data;
    }
  });

  // Buscar trabalhos de geração
  const { data: generationJobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['generation-jobs'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/organization/generation-jobs');
      return response.data;
    }
  });

  // Função para navegar para a página de análise organizacional
  function goToOrganizationAnalysis() {
    router.push('/organization-analysis');
  }

  // Função para navegar para a página de detalhes do agente
  function viewAgentDetails(agentId) {
    router.push(`/agents/${agentId}`);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Gerencie seus agentes autônomos</p>
        </div>
        <Button onClick={goToOrganizationAnalysis}>
          Nova Análise Organizacional
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Meus Agentes</TabsTrigger>
          <TabsTrigger value="generation">Geração de Agentes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {isLoadingAgents ? (
              <p>Carregando agentes...</p>
            ) : agents && agents.length > 0 ? (
              agents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      <Badge variant={agent.is_active ? "default" : "outline"}>
                        {agent.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <CardDescription>{agent.role || "Assistente"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {agent.description || "Sem descrição disponível."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{agent.type}</Badge>
                      {agent.config?.channels?.enabled?.map((channel) => (
                        <Badge key={channel} variant="secondary">{channel}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => viewAgentDetails(agent.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nenhum agente encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não tem agentes criados. Realize uma análise organizacional para receber recomendações.
                </p>
                <Button onClick={goToOrganizationAnalysis}>
                  Iniciar Análise Organizacional
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="generation">
          <Card>
            <CardHeader>
              <CardTitle>Trabalhos de Geração de Agentes</CardTitle>
              <CardDescription>
                Acompanhe o status dos seus trabalhos de geração de agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingJobs ? (
                <p>Carregando trabalhos...</p>
              ) : generationJobs && generationJobs.length > 0 ? (
                <div className="space-y-6">
                  {generationJobs.map((job) => (
                    <div key={job.job_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Trabalho #{job.job_id.substring(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Criado em: {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            job.status === "completed" ? "default" :
                            job.status === "failed" ? "destructive" :
                            "outline"
                          }
                        >
                          {job.status === "completed" ? "Concluído" :
                           job.status === "failed" ? "Falhou" :
                           job.status === "in_progress" ? "Em Progresso" :
                           "Pendente"}
                        </Badge>
                      </div>
                      
                      {job.status === "in_progress" && (
                        <div className="mb-2">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-right mt-1">{job.progress}%</p>
                        </div>
                      )}
                      
                      {job.status === "completed" && (
                        <div className="mt-4">
                          <p className="text-sm">
                            <span className="font-medium">Agentes gerados:</span> {job.agent_count}
                          </p>
                          {job.completed_at && (
                            <p className="text-sm">
                              <span className="font-medium">Concluído em:</span> {new Date(job.completed_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {job.status === "failed" && (
                        <div className="mt-4">
                          <p className="text-sm text-destructive">
                            <span className="font-medium">Erro:</span> {job.error || "Erro desconhecido"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Nenhum trabalho encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    Você ainda não iniciou nenhum trabalho de geração de agentes.
                  </p>
                  <Button onClick={goToOrganizationAnalysis}>
                    Iniciar Análise Organizacional
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Visualize métricas e desempenho dos seus agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {agents?.length || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {agents?.filter(a => a.is_active)?.length || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Trabalhos de Geração</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {generationJobs?.length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Analytics em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Métricas detalhadas e visualizações estarão disponíveis em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
