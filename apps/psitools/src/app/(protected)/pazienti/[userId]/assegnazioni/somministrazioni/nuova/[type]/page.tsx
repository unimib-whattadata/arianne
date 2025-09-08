'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import CompilationForm from '@/features/questionnaires/components/compilation-form';
import { NewQuestionnaireLoader } from '@/features/questionnaires/components/new-questionnair-loader';
import { AdministrationProvider } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';

const getContent = (type: (typeof available)[number]) => {
  if (!type) return NewQuestionnaireLoader;
  return dynamic(() => import(`@/features/questionnaires/${type}/new`), {
    loading: NewQuestionnaireLoader,
  });
};

export default function NewAdministrationPage({
  params,
}: {
  params: Promise<{ type: (typeof available)[number] }>;
}) {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { type } = use(params);

  const Content = getContent(type);

  useEffect(() => {
    if (searchParams?.has('therapistName')) {
      setStep(2);
    }
  }, [searchParams]);

  const handleFormCompletion = (queryString: string) => {
    router.push(`?${queryString}`);
  };

  return (
    <AdministrationProvider>
      {step === 1 ? (
        <CompilationForm
          administrationId={type}
          onFormComplete={handleFormCompletion}
        />
      ) : (
        <Content />
      )}
    </AdministrationProvider>
  );
}
