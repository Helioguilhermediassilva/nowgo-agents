import React from 'react';
import { useTranslations } from 'next-intl';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

// Criação do cliente de consulta React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const { messages, locale } = pageProps;
  
  // Use o layout personalizado do componente, se disponível
  const getLayout = (Component as any).getLayout || ((page: React.ReactElement) => page);

  return (
    <NextIntlClientProvider locale={locale || 'pt'} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {getLayout(<Component {...pageProps} />)}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
