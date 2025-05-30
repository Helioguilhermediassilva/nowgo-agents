import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Esquema de validação do formulário
const authSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um email válido',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres',
  }),
});

export function AuthForm({ mode = 'login' }) {
  const t = useTranslations('Auth');
  const { theme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const { login, register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        toast({
          title: t('login.success.title'),
          description: t('login.success.description'),
          variant: 'success',
        });
        router.push('/dashboard');
      } else {
        await registerUser(data.email, data.password);
        toast({
          title: t('register.success.title'),
          description: t('register.success.description'),
          variant: 'success',
        });
        router.push('/login');
      }
    } catch (error) {
      toast({
        title: mode === 'login' ? t('login.error.title') : t('register.error.title'),
        description: error.message || (mode === 'login' ? t('login.error.description') : t('register.error.description')),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto animate-fadeIn">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <img 
              src="/images/logo.svg" 
              alt="NowGo Agents" 
              className="h-12"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = theme === 'dark' 
                  ? '/images/logo-placeholder-light.svg' 
                  : '/images/logo-placeholder-dark.svg';
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? t('login.title') : t('register.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' ? t('login.description') : t('register.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('fields.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@empresa.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('fields.password')}</Label>
                {mode === 'login' && (
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    {t('login.forgotPassword')}
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'login' ? t('login.loading') : t('register.loading'))
              : (mode === 'login' ? t('login.submit') : t('register.submit'))
            }
          </Button>
          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p>
                {t('login.noAccount')}{' '}
                <Link href="/register" className="text-primary hover:underline">
                  {t('login.createAccount')}
                </Link>
              </p>
            ) : (
              <p>
                {t('register.hasAccount')}{' '}
                <Link href="/login" className="text-primary hover:underline">
                  {t('register.login')}
                </Link>
              </p>
            )}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>
              {t('footer.poweredBy')}{' '}
              <a 
                href="https://github.com/EvolutionAPI/evo-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                EvolutionAPI/evo-ai
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
