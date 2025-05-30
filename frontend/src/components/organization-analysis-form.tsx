import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useOrganizationAnalysis } from '@/hooks/useOrganizationAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

// Esquema de validação do formulário
const organizationAnalysisSchema = z.object({
  // Informações básicas
  name: z.string().min(2, {
    message: 'O nome da organização deve ter pelo menos 2 caracteres',
  }),
  industry: z.string({
    required_error: 'Por favor, selecione um setor',
  }),
  size: z.string({
    required_error: 'Por favor, selecione o tamanho da organização',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres',
  }),
  
  // Canais de comunicação
  channels: z.object({
    whatsapp: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    linkedin: z.boolean().optional(),
  }),
  
  // Idiomas
  languages: z.object({
    portuguese: z.boolean().optional(),
    english: z.boolean().optional(),
    spanish: z.boolean().optional(),
  }),
  
  // Integrações
  integrations: z.object({
    crm: z.boolean().optional(),
    erp: z.boolean().optional(),
    ecommerce: z.boolean().optional(),
    helpdesk: z.boolean().optional(),
  }),
  
  // Objetivos
  objectives: z.object({
    customer_support: z.boolean().optional(),
    sales: z.boolean().optional(),
    marketing: z.boolean().optional(),
    internal_communication: z.boolean().optional(),
  }),
});

export function OrganizationAnalysisForm() {
  const t = useTranslations('OrganizationAnalysis');
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const { submitAnalysis, isLoading, error } = useOrganizationAnalysis();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(organizationAnalysisSchema),
    defaultValues: {
      name: '',
      industry: '',
      size: '',
      description: '',
      channels: {
        whatsapp: true,
        email: true,
        phone: true,
        linkedin: true,
      },
      languages: {
        portuguese: true,
        english: true,
        spanish: true,
      },
      integrations: {
        crm: true,
      },
      objectives: {
        customer_support: true,
        sales: true,
      },
    },
  });
  
  const onSubmit = async (data) => {
    try {
      // Enviar dados para o backend
      const result = await submitAnalysis(data);
      
      toast({
        title: t('success.title'),
        description: t('success.description'),
        variant: 'success',
      });
      
      // Redirecionar para a página de resultados
      router.push(`/dashboard/analysis-results?id=${result.analysisId}`);
    } catch (err) {
      toast({
        title: t('error.title'),
        description: err.message || t('error.description'),
        variant: 'destructive',
      });
    }
  };
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  const handleNextTab = () => {
    const tabs = ['basic', 'channels', 'languages', 'integrations', 'objectives'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePreviousTab = () => {
    const tabs = ['basic', 'channels', 'languages', 'integrations', 'objectives'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          {t('buttons.cancel')}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('formTitle')}</CardTitle>
            <CardDescription>{t('formDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="basic">{t('tabs.basic')}</TabsTrigger>
                <TabsTrigger value="channels">{t('tabs.channels')}</TabsTrigger>
                <TabsTrigger value="languages">{t('tabs.languages')}</TabsTrigger>
                <TabsTrigger value="integrations">{t('tabs.integrations')}</TabsTrigger>
                <TabsTrigger value="objectives">{t('tabs.objectives')}</TabsTrigger>
              </TabsList>
              
              {/* Informações Básicas */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fields.name.label')}</Label>
                    <Input
                      id="name"
                      placeholder={t('fields.name.placeholder')}
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">{t('fields.industry.label')}</Label>
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="industry" className={errors.industry ? 'border-red-500' : ''}>
                            <SelectValue placeholder={t('fields.industry.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">{t('fields.industry.options.technology')}</SelectItem>
                            <SelectItem value="finance">{t('fields.industry.options.finance')}</SelectItem>
                            <SelectItem value="healthcare">{t('fields.industry.options.healthcare')}</SelectItem>
                            <SelectItem value="education">{t('fields.industry.options.education')}</SelectItem>
                            <SelectItem value="retail">{t('fields.industry.options.retail')}</SelectItem>
                            <SelectItem value="manufacturing">{t('fields.industry.options.manufacturing')}</SelectItem>
                            <SelectItem value="services">{t('fields.industry.options.services')}</SelectItem>
                            <SelectItem value="other">{t('fields.industry.options.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.industry && (
                      <p className="text-sm text-red-500">{errors.industry.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">{t('fields.size.label')}</Label>
                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="size" className={errors.size ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('fields.size.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{t('fields.size.options.small')}</SelectItem>
                          <SelectItem value="medium">{t('fields.size.options.medium')}</SelectItem>
                          <SelectItem value="large">{t('fields.size.options.large')}</SelectItem>
                          <SelectItem value="enterprise">{t('fields.size.options.enterprise')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.size && (
                    <p className="text-sm text-red-500">{errors.size.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('fields.description.label')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('fields.description.placeholder')}
                    {...register('description')}
                    className={errors.description ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={handleNextTab}>
                    {t('buttons.next')}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Canais de Comunicação */}
              <TabsContent value="channels" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('sections.channels.title')}</h3>
                  <p className="text-muted-foreground">{t('sections.channels.description')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="channels.whatsapp"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="whatsapp"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="channels.email"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="email"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="email" className="cursor-pointer">Email</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="channels.phone"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="phone"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="phone" className="cursor-pointer">{t('fields.channels.phone')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="channels.linkedin"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="linkedin"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="linkedin" className="cursor-pointer">LinkedIn</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousTab}>
                    {t('buttons.previous')}
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    {t('buttons.next')}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Idiomas */}
              <TabsContent value="languages" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('sections.languages.title')}</h3>
                  <p className="text-muted-foreground">{t('sections.languages.description')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="languages.portuguese"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="portuguese"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="portuguese" className="cursor-pointer">{t('fields.languages.portuguese')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="languages.english"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="english"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="english" className="cursor-pointer">{t('fields.languages.english')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="languages.spanish"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="spanish"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="spanish" className="cursor-pointer">{t('fields.languages.spanish')}</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousTab}>
                    {t('buttons.previous')}
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    {t('buttons.next')}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Integrações */}
              <TabsContent value="integrations" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('sections.integrations.title')}</h3>
                  <p className="text-muted-foreground">{t('sections.integrations.description')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="integrations.crm"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="crm"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="crm" className="cursor-pointer">CRM</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="integrations.erp"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="erp"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="erp" className="cursor-pointer">ERP</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="integrations.ecommerce"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="ecommerce"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="ecommerce" className="cursor-pointer">E-commerce</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="integrations.helpdesk"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="helpdesk"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="helpdesk" className="cursor-pointer">Helpdesk</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousTab}>
                    {t('buttons.previous')}
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    {t('buttons.next')}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Objetivos */}
              <TabsContent value="objectives" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('sections.objectives.title')}</h3>
                  <p className="text-muted-foreground">{t('sections.objectives.description')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="objectives.customer_support"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="customer_support"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="customer_support" className="cursor-pointer">{t('fields.objectives.customer_support')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="objectives.sales"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="sales"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="sales" className="cursor-pointer">{t('fields.objectives.sales')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="objectives.marketing"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="marketing"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="marketing" className="cursor-pointer">{t('fields.objectives.marketing')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="objectives.internal_communication"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="internal_communication"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="internal_communication" className="cursor-pointer">{t('fields.objectives.internal_communication')}</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePreviousTab}>
                    {t('buttons.previous')}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t('buttons.analyzing') : t('buttons.analyze')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
