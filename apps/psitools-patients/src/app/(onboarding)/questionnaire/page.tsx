'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import {
  stepsMap,
  getStepFlow,
  validationMap,
} from '@/app/(onboarding)/questionnaire/_lib/step-flow';
import Navbar from '@/app/(onboarding)/questionnaire/_components/navbar';
import { getDefaultFormValues } from '@/app/(onboarding)/questionnaire/_lib/get-default-values';
import FullSchema from '@/app/(onboarding)/questionnaire/_schema/therapy-form-schema';
import CurvedProgressBar from '@/app/(onboarding)/questionnaire/_components/progressBar';
import { toast } from 'sonner';

export default function QuestionnairePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submittedData, setSubmittedData] = useState<z.infer<
    typeof FullSchema
  > | null>(null);

  const form = useForm<z.infer<typeof FullSchema>>({
    resolver: zodResolver(FullSchema),
    mode: 'onChange',
    defaultValues: getDefaultFormValues('individual'),
  });
  console.log({ formValues: form.getValues() });
  console.log({ currentStepIndex, flow: getStepFlow(form.getValues()) });
  console.log({
    currentStepKey: getStepFlow(form.getValues())[currentStepIndex],
  });

  const formValues = useWatch({ control: form.control });
  const flow = getStepFlow(formValues as z.infer<typeof FullSchema>);
  const currentStepKey = flow[currentStepIndex];
  const StepComponent = currentStepKey
    ? (stepsMap[currentStepKey] as React.FC<{ form: typeof form }>)
    : null;

  const handleNextStep = async () => {
    const currentStepKey = flow[currentStepIndex];
    if (!currentStepKey) return;

    const fieldsToValidate = validationMap[currentStepKey];

    if (fieldsToValidate && fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('Per favore seleziona una risposta prima di proseguire');
        return;
      }
    }

    setCurrentStepIndex((prev) =>
      flow.length ? Math.min(prev + 1, flow.length - 1) : 0,
    );
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = () => {
    setSubmittedData(formValues as z.infer<typeof FullSchema>);
  };

  return (
    <div
      className={cn(
        'h-full-safe mt-8 flex flex-col items-center gap-6 p-4 pt-12 md:mt-0 md:p-10',
        currentStepIndex === 0
          ? 'justify-center md:h-dvh'
          : 'justify-between md:mt-10',
      )}
    >
      <Form {...form}>
        <div className="relative flex w-full flex-col gap-5">
          {currentStepIndex === 0 ? (
            ''
          ) : (
            <CurvedProgressBar
              currentStep={currentStepIndex}
              totalSteps={flow.length}
            />
          )}
          <div className="mx-auto mb-10 w-full max-w-3xl">
            {StepComponent ? <StepComponent form={form} /> : null}
          </div>
        </div>
        <Navbar
          currentStep={currentStepIndex}
          totalSteps={flow.length}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          handleOnSubmit={onSubmit}
        />
      </Form>
      {submittedData && (
        <p className="mt-6 w-full max-w-4xl rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(formValues, null, 2)}
        </p>
      )}
    </div>
  );
}
