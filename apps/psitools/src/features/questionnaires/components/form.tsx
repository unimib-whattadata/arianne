'use client';

import type { modality } from '@prisma/client';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderIcon, SendIcon, Verified } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { createContext, useContext } from 'react';
import type {
  FieldValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { toast } from 'sonner';
import type { ClassNameValue } from 'tailwind-merge';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAdministrationContext } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';
import { cn } from '@/utils/cn';

export interface CompilationData {
  therapistName: string;
  therapistLastname: string;

  modality: modality;
  createdAt: string;
}

interface FormContextType {
  viewOnly?: boolean;
  compilationData: CompilationData;
}

const FormContext = createContext<FormContextType>({} as FormContextType);

const FormContextProvider = (props: {
  viewOnly?: boolean;
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();

  const compilationData: CompilationData = {
    therapistName: searchParams.get('therapistName') || '',
    therapistLastname: searchParams.get('therapistLastname') || '',

    modality: searchParams.get('modality') as modality,
    createdAt: searchParams.get('createdAt') || '',
  };

  return (
    <FormContext.Provider
      value={{
        viewOnly: props.viewOnly,
        compilationData,
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};

// Hook to use form context
export const useFormContext = () => useContext(FormContext);

interface FormTitleProps {
  title: string;
}

export const FormTitle = (props: FormTitleProps) => {
  const { title } = props;
  return (
    <h1 className="z-0 mx-auto max-w-prose leading-tight">
      <span className="font-h1">{title}</span>
    </h1>
  );
};

interface FormContentProps<FormValues extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<FormValues>;
  title: string;
  viewOnly?: boolean;
  className?: ClassNameValue;
}

export const FormContent = <FormValues extends FieldValues>(
  props: FormContentProps<FormValues>,
) => {
  const { children, form, title } = props;

  return (
    <FormContextProvider viewOnly={props.viewOnly}>
      <Form {...form}>
        <header className="bg-gray-10 sticky top-0 mx-auto flex justify-center pb-3">
          <FormTitle title={title} />
        </header>
        <div className="relative pb-8">
          <form className="mx-auto max-w-prose space-y-6">
            <section className="pb-4">{children}</section>
          </form>
        </div>
      </Form>
    </FormContextProvider>
  );
};

interface FormHeaderProps {
  children?: React.ReactNode;
  className?: ClassNameValue;
}

export const FormHeader = (props: FormHeaderProps) => {
  const { viewOnly } = useFormContext();
  return (
    <header className="bg-gray-10 sticky top-0 z-10 w-full space-y-4 pb-4">
      {props.children}
      {viewOnly && (
        <p className="font-h3 absolute top-80 -right-32 z-20 rotate-90">
          (sola visualizzazione)
        </p>
      )}
    </header>
  );
};

interface FormInstructionsProps {
  children: React.ReactNode;
}

export const FormInstructions = (props: FormInstructionsProps) => {
  const { children } = props;
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-md bg-white px-4"
    >
      <AccordionItem value="expandible" className="border-b-0">
        <AccordionTrigger
          className="flex items-center justify-between font-bold"
          icon="CircleHelp"
          iconClassName="h-5 w-5 text-primary"
        >
          Istruzioni
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

interface FormFooterProps {
  type: (typeof available)[number];
  children: React.ReactNode;
  className?: ClassNameValue;
}

export const FormFooter = (props: FormFooterProps) => {
  const { type, children, className } = props;

  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

  const { id, sent, dispatch } = useAdministrationContext();

  const navigateToResults = () => {
    if (!userId) return;
    try {
      router.replace(
        `/pazienti/${userId}/assegnazioni/somministrazioni/risultati/${type}/administration/${id}`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const setSent = (open: boolean) => {
    dispatch({ type: 'set_sent', payload: { sent: open } });
  };

  return (
    <>
      <footer className="bg-gray-10 absolute right-0 bottom-0 left-0 flex justify-center p-3">
        <div className={cn('flex w-full max-w-prose', className)}>
          {children}
        </div>
      </footer>
      <div className="mx-auto mt-auto flex w-full justify-end">
        <AlertDialog open={sent} onOpenChange={setSent}>
          <AlertDialogContent
            portalProps={{
              className: 'absolute mt-3 h-full-safe',
            }}
            overlayProps={{
              className: 'absolute',
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Verified className="text-primary mr-1.5 h-20 w-20" />
                Il questionario è stato caricato con successo!
              </AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Il questionario è stato caricato con successo! Torna alla pagina
                delle somministrazioni o vai al risultato
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col">
              <AlertDialogAction
                variant="ghost"
                className="text-primary"
                onClick={() =>
                  router.push(
                    `/pazienti/${userId}/assegnazioni/somministrazioni`,
                  )
                }
              >
                Torna alla pagina delle somministrazioni
              </AlertDialogAction>
              <AlertDialogAction onClick={() => navigateToResults()}>
                Vai al risultato
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

interface FormSubmitProps<FormValues extends FieldValues> {
  form: UseFormReturn<FormValues>;
  onSubmit: SubmitHandler<FormValues> | undefined;
  errorTitle?: string;
  errorMessage?: string;
}

const Loader2 = motion.create(LoaderIcon);
const Send = motion.create(SendIcon);

export const FormSubmit = <FormValues extends FieldValues>(
  props: FormSubmitProps<FormValues>,
) => {
  const { form, onSubmit } = props;
  const { compilationData } = useFormContext();

  const { isSubmitting } = useAdministrationContext();

  const onError: SubmitErrorHandler<FormValues> = () => {
    toast.warning(
      'Compila tutti gli item del questionario per poter inviare la somministrazione.',
    );
  };

  if (!onSubmit) return null;

  const handleSubmit = async () => {
    Object.entries(compilationData).forEach(([key, value]) => {
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        form.setValue(key as Path<FormValues>, value);
      }
    });

    await form.handleSubmit(onSubmit, onError)();
  };

  return (
    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
      <span>Invia</span>
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <Loader2 key="icon" className="mr-2 ml-1 h-4 w-4 animate-spin" />
        ) : (
          <Send key="icon" className="mr-2 ml-1 h-4 w-4 rotate-45" />
        )}
      </AnimatePresence>
    </Button>
  );
};
