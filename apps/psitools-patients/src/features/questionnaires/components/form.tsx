import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 as LoaderIcon, Send as SendIcon } from 'lucide-react';
import { createContext, useContext } from 'react';
import type {
  FieldValues,
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
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAdministrationContext } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';
import { cn } from '@/utils/cn';

const FormContext = createContext<{ viewOnly?: boolean }>({});

const FormContextProvider = (props: {
  viewOnly?: boolean;
  children: React.ReactNode;
}) => (
  <FormContext.Provider value={{ viewOnly: props.viewOnly }}>
    {props.children}
  </FormContext.Provider>
);

interface FormTitleProps {
  title: string;
}

export const FormTitle = (props: FormTitleProps) => {
  const { title } = props;
  return (
    <h1 className="mx-auto max-w-prose leading-tight">
      <span className="text-xl font-semibold text-primary">{title}</span>
    </h1>
  );
};

interface FormHeaderProps {
  children?: React.ReactNode;
}

export const FormHeader = (props: FormHeaderProps) => {
  const { viewOnly } = useContext(FormContext);
  return (
    <header className="sticky top-[var(--header-height)] z-10 w-full space-y-4 bg-background pb-4">
      {props.children}
      {viewOnly && (
        <p className="font-h3 absolute -right-32 top-80 z-20 rotate-90">
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
      className="w-full rounded-md bg-card px-4"
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
  const { children, className } = props;

  return (
    <footer className="flex justify-center bg-background py-3">
      <div className={cn('flex w-full max-w-prose', className)}>{children}</div>
    </footer>
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
  const { form, onSubmit, errorMessage } = props;

  const { isSubmitting } = useAdministrationContext();

  const onError: SubmitErrorHandler<FormValues> = () => {
    toast.error(
      errorMessage || 'Compila tutti i campi prima di inviare il questionario',
    );
  };

  if (!onSubmit) return null;

  return (
    <Button
      type="button"
      onClick={form.handleSubmit(onSubmit, onError)}
      disabled={isSubmitting}
    >
      <span>Invia</span>
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <Loader2 key="icon" className="ml-1 mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send key="icon" className="ml-1 mr-2 h-4 w-4 rotate-45" />
        )}
      </AnimatePresence>
    </Button>
  );
};

interface FormContentProps<FormValues extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<FormValues>;
  title: string;
  viewOnly?: boolean;
}

export const FormContent = <FormValues extends FieldValues>(
  props: FormContentProps<FormValues>,
) => {
  const { children, form, title } = props;

  return (
    <FormContextProvider viewOnly={props.viewOnly}>
      <Form {...form}>
        <header className="sticky top-[var(--header-height)] z-10 mx-auto flex justify-center bg-background pb-3">
          <FormTitle title={title} />
        </header>
        <section className="relative">
          <form className="mx-auto max-w-prose space-y-6">{children}</form>
        </section>
      </Form>
    </FormContextProvider>
  );
};
