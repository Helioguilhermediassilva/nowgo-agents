import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Esquema de validação para o formulário de análise organizacional
const organizationProfileSchema = z.object({
  industry: z.string({
    required_error: "Por favor, selecione o setor da empresa.",
  }),
  company_size: z.string({
    required_error: "Por favor, selecione o tamanho da empresa.",
  }),
  has_sales_team: z.boolean().default(true),
  has_customer_service: z.boolean().default(true),
  has_marketing: z.boolean().default(true),
  has_hr: z.boolean().default(true),
  has_finance: z.boolean().default(true),
  has_operations: z.boolean().default(true),
  uses_whatsapp: z.boolean().default(false),
  uses_email: z.boolean().default(true),
  uses_phone: z.boolean().default(true),
  uses_linkedin: z.boolean().default(false),
  primary_language: z.string().default("pt"),
  crm_system: z.string().optional(),
});

// Opções para os campos de seleção
const industryOptions = [
  { value: "technology", label: "Tecnologia" },
  { value: "finance", label: "Finanças" },
  { value: "healthcare", label: "Saúde" },
  { value: "retail", label: "Varejo" },
  { value: "manufacturing", label: "Manufatura" },
  { value: "education", label: "Educação" },
  { value: "real_estate", label: "Imobiliário" },
  { value: "hospitality", label: "Hotelaria" },
  { value: "transportation", label: "Transporte" },
  { value: "energy", label: "Energia" },
  { value: "agriculture", label: "Agricultura" },
  { value: "entertainment", label: "Entretenimento" },
  { value: "legal", label: "Jurídico" },
  { value: "consulting", label: "Consultoria" },
  { value: "other", label: "Outro" },
];

const companySizeOptions = [
  { value: "small", label: "Pequena (1-50 funcionários)" },
  { value: "medium", label: "Média (51-500 funcionários)" },
  { value: "large", label: "Grande (501-5000 funcionários)" },
  { value: "enterprise", label: "Corporação (5000+ funcionários)" },
];

const languageOptions = [
  { value: "pt", label: "Português" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
];

export function OrganizationAnalysisForm() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisProgress, setAnalysisProgress] = React.useState(0);
  const [analysisComplete, setAnalysisComplete] = React.useState(false);
  const [recommendedAgents, setRecommendedAgents] = React.useState([]);
  const [selectedAgents, setSelectedAgents] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("profile");

  // Inicializar o formulário com react-hook-form
  const form = useForm<z.infer<typeof organizationProfileSchema>>({
    resolver: zodResolver(organizationProfileSchema),
    defaultValues: {
      has_sales_team: true,
      has_customer_service: true,
      has_marketing: true,
      has_hr: true,
      has_finance: true,
      has_operations: true,
      uses_whatsapp: false,
      uses_email: true,
      uses_phone: true,
      uses_linkedin: false,
      primary_language: "pt",
    },
  });

  // Função para enviar o formulário
  async function onSubmit(values: z.infer<typeof organizationProfileSchema>) {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(10);
      
      // Enviar dados para a API
      const response = await axios.post('/api/v1/organization/profile', values);
      
      setAnalysisProgress(50);
      
      // Iniciar análise
      const analysisResponse = await axios.post('/api/v1/organization/analyze');
      
      // Simular progresso da análise
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Verificar resultados da análise
      setTimeout(async () => {
        try {
          const resultsResponse = await axios.get('/api/v1/organization/analysis-results');
          
          if (resultsResponse.data.status === "complete") {
            setRecommendedAgents(resultsResponse.data.recommended_agents);
            setAnalysisComplete(true);
            setAnalysisProgress(100);
            setActiveTab("results");
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Erro ao obter resultados da análise:", error);
          toast.error("Erro ao obter resultados da análise. Tente novamente.");
        } finally {
          setIsAnalyzing(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao enviar formulário. Tente novamente.");
      setIsAnalyzing(false);
    }
  }

  // Função para selecionar/deselecionar agentes recomendados
  function toggleAgentSelection(agentId) {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  }

  // Função para gerar agentes selecionados
  async function generateSelectedAgents() {
    if (selectedAgents.length === 0) {
      toast.warning("Selecione pelo menos um agente para gerar.");
      return;
    }

    try {
      const response = await axios.post('/api/v1/organization/generate-agents', {
        selected_templates: selectedAgents
      });

      toast.success(`Geração de ${selectedAgents.length} agentes iniciada com sucesso!`);
      
      // Redirecionar para página de status da geração
      // window.location.href = `/generation-status/${response.data.job_id}`;
      
    } catch (error) {
      console.error("Erro ao gerar agentes:", error);
      toast.error("Erro ao gerar agentes. Tente novamente.");
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Análise Organizacional</h1>
      <p className="text-center text-muted-foreground mb-10">
        Preencha o perfil da sua organização para receber recomendações de agentes personalizados
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil Organizacional</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisComplete}>Resultados da Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil da Organização</CardTitle>
              <CardDescription>
                Forneça informações sobre sua empresa para análise personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações básicas */}
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o setor da empresa" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industryOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamanho da Empresa</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tamanho da empresa" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {companySizeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primary_language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idioma Principal</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o idioma principal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {languageOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crm_system"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sistema CRM</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Salesforce, HubSpot, etc." {...field} />
                            </FormControl>
                            <FormDescription>
                              Informe o sistema CRM utilizado pela empresa (opcional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Departamentos e Canais */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Departamentos</h3>
                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="has_sales_team"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Equipe de Vendas</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="has_customer_service"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Atendimento ao Cliente</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="has_marketing"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Marketing</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="has_hr"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Recursos Humanos</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="has_finance"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Finanças</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="has_operations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Operações</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Canais de Comunicação</h3>
                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="uses_whatsapp"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>WhatsApp</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="uses_email"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Email</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="uses_phone"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Telefone</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="uses_linkedin"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>LinkedIn</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isAnalyzing}>
                      {isAnalyzing ? "Analisando..." : "Analisar Organização"}
                    </Button>
                  </div>
                </form>
              </Form>

              {isAnalyzing && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-muted-foreground">Analisando perfil organizacional...</p>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Agentes Recomendados</CardTitle>
              <CardDescription>
                Com base na análise do perfil da sua organização, recomendamos os seguintes agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedAgents.length > 0 ? (
                <div className="space-y-4">
                  {recommendedAgents.map((agent) => (
                    <div key={agent.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Checkbox
                        checked={selectedAgents.includes(agent.id)}
                        onCheckedChange={() => toggleAgentSelection(agent.id)}
                      />
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {agent.department || "Geral"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {agent.agent_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  Nenhum agente recomendado encontrado. Tente ajustar o perfil da organização.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("profile")}>
                Voltar ao Perfil
              </Button>
              <Button 
                onClick={generateSelectedAgents}
                disabled={selectedAgents.length === 0}
              >
                Gerar {selectedAgents.length} Agentes Selecionados
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
