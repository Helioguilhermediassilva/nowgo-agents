import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// Componentes UI
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <Select
      defaultValue={router.locale || 'pt'}
      onValueChange={changeLanguage}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pt">Português</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
      </SelectContent>
    </Select>
  );
}
