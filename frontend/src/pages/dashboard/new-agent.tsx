import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Layout } from '@/components/layout';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { useToast } from '@/components/ui/use-toast';

// Esquema de validação do formulário
const agentCreationSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do agente deve ter pelo menos 2 caracteres',
  }),
  type: z.string({
    required_error: 'Por favor, selecione um tipo de agente',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres',
  }),
  prompt: z.string().min(20, {
    message: 'O prompt deve ter pelo menos 20 caracteres',
  }),
  personality: z.string({
    required_error: 'Por favor, selecione uma personalidade',
  }),
  model: z.string({
    required_error: 'Por favor, selecione um modelo',
  }),
});

export default function NewAgentPage() {
  const t = useTranslations('NewAgent');
  const { theme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agentCreationSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      prompt: '',
      personality: 'friendly',
      model: 'gpt-4',
    },
  });
  
  const onSubmit = async (data) => {
    try {
      // Simulação de criação de agente
      console.log('Criando agente:', data);
      
      toast({
        title: t('success.title'),
        description: t('success.description', { name: data.name }),
        variant: 'success',
      });
      
      // Redirecionar para o dashboard após criação bem-sucedida
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      toast({
        title: t('error.title'),
        description: error.message || t('error.description'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <>
      <Head>
        <title>{t('pageTitle')} | NowGo Agents</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>
      
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <Button variant="outline" onClick={() => router.back()}>
            {t('buttons.cancel')}
          </Button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('basicInfo.title')}</CardTitle>
              <CardDescription>{t('basicInfo.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <Label htmlFor="type">{t('fields.type.label')}</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('fields.type.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer_support">{t('fields.type.options.customer_support')}</SelectItem>
                          <SelectItem value="sales">{t('fields.type.options.sales')}</SelectItem>
                          <SelectItem value="marketing">{t('fields.type.options.marketing')}</SelectItem>
                          <SelectItem value="hr">{t('fields.type.options.hr')}</SelectItem>
                          <SelectItem value="finance">{t('fields.type.options.finance')}</SelectItem>
                          <SelectItem value="custom">{t('fields.type.options.custom')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('fields.description.label')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('fields.description.placeholder')}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('configuration.title')}</CardTitle>
              <CardDescription>{t('configuration.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">{t('fields.prompt.label')}</Label>
                <Textarea
                  id="prompt"
                  placeholder={t('fields.prompt.placeholder')}
                  {...register('prompt')}
                  className={errors.prompt ? 'border-red-500' : ''}
                  rows={6}
                />
                {errors.prompt && (
                  <p className="text-sm text-red-500">{errors.prompt.message}</p>
                )}
                <p className="text-sm text-muted-foreground">{t('fields.prompt.help')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personality">{t('fields.personality.label')}</Label>
                  <Controller
                    name="personality"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="personality" className={errors.personality ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('fields.personality.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">{t('fields.personality.options.friendly')}</SelectItem>
                          <SelectItem value="professional">{t('fields.personality.options.professional')}</SelectItem>
                          <SelectItem value="casual">{t('fields.personality.options.casual')}</SelectItem>
                          <SelectItem value="enthusiastic">{t('fields.personality.options.enthusiastic')}</SelectItem>
                          <SelectItem value="empathetic">{t('fields.personality.options.empathetic')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.personality && (
                    <p className="text-sm text-red-500">{errors.personality.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">{t('fields.model.label')}</Label>
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="model" className={errors.model ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('fields.model.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">{t('fields.model.options.gpt4')}</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">{t('fields.model.options.gpt35')}</SelectItem>
                          <SelectItem value="claude-3-opus">{t('fields.model.options.claude3')}</SelectItem>
                          <SelectItem value="llama-3-70b">{t('fields.model.options.llama3')}</SelectItem>
                          <SelectItem value="gemini-pro">{t('fields.model.options.gemini')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.model && (
                    <p className="text-sm text-red-500">{errors.model.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('channels.title')}</CardTitle>
              <CardDescription>{t('channels.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">{t('channels.phone')}</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                </TabsList>
                
                <TabsContent value="whatsapp" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">{t('channels.whatsapp.number')}</Label>
                    <Input id="whatsapp_number" placeholder="+55 11 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_greeting">{t('channels.whatsapp.greeting')}</Label>
                    <Textarea id="whatsapp_greeting" placeholder={t('channels.whatsapp.greetingPlaceholder')} rows={3} />
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_address">{t('channels.email.address')}</Label>
                    <Input id="email_address" placeholder="agente@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_signature">{t('channels.email.signature')}</Label>
                    <Textarea id="email_signature" placeholder={t('channels.email.signaturePlaceholder')} rows={3} />
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">{t('channels.phone.number')}</Label>
                    <Input id="phone_number" placeholder="+55 11 3333-3333" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_greeting">{t('channels.phone.greeting')}</Label>
                    <Textarea id="phone_greeting" placeholder={t('channels.phone.greetingPlaceholder')} rows={3} />
                  </div>
                </TabsContent>
                
                <TabsContent value="linkedin" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_profile">{t('channels.linkedin.profile')}</Label>
                    <Input id="linkedin_profile" placeholder="https://linkedin.com/in/nome-do-agente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_message">{t('channels.linkedin.message')}</Label>
                    <Textarea id="linkedin_message" placeholder={t('channels.linkedin.messagePlaceholder')} rows={3} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              {t('buttons.cancel')}
            </Button>
            <Button type="submit">
              {t('buttons.create')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

// Usa o layout padrão para a página de criação de agente
NewAgentPage.getLayout = (page) => <Layout>{page}</Layout>;
