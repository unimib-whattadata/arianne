import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { ItemStepOne } from '@/features/questionnaires/eriraos-cl/item-step-one';
import { ItemStepTwo } from '@/features/questionnaires/eriraos-cl/item-step-two';
import { QUESTIONS } from '@/features/questionnaires/eriraos-cl/questions';
import type { FormValues } from '@/features/questionnaires/eriraos-cl/schema';
import { formSchema } from '@/features/questionnaires/eriraos-cl/schema';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const [step, setStep] = useState(1);
  const [expand, setExpand] = useState<Record<string, boolean>>({
    'item-1': false,
    'item-2': false,
    'item-3': false,
    'item-4': false,
    'item-5': false,
    'item-6': false,
    'item-7': false,
    'item-8': false,
    'item-9': false,
    'item-10': false,
    'item-11': false,
    'item-12': false,
    'item-13': false,
    'item-14': false,
    'item-15': false,
    'item-16': false,
    'item-17': false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const isAllExpanded = Object.values(expand).every((value) => value);

  const setExpandAll = () => {
    setExpand((prev) =>
      Object.fromEntries(
        Object.keys(prev).map((key) => [key, isAllExpanded ? false : true]),
      ),
    );
  };

  const formatRecords = (data: FormValues) => {
    return {
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'eriraos-cl',
  });

  const QUETIONS_ONE = QUESTIONS.slice(0, 13);
  const QUETIONS_TWO = QUESTIONS.slice(13);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Early Recognition Inventory for the retrospective assessment of
              the onset of schizophrenia Checklist (ERIraos-CL)"
    >
      <FormHeader>
        <FormInstructions>
          La presente intervista può aiutare a valutare se una persona ha
          provato alcune esperienze particolari nel corso degli ultimi sei mesi.
          Le risposte alle domande dell&apos;intervista potranno permettere di
          identificare i segnali precoci di disturbo mentale.
          <ul className="list-disc pl-5 text-sm">
            <li>
              Se la persona conferma senza alcun dubbio la presenza di un
              sintomo nel periodo considerato, barrate la casella intestata SI.
            </li>
            <li>
              Se la persona nega chiaramente la presenza di un sintomo, barrate
              la casella intestata NO.{' '}
            </li>
            <li>
              Nel caso in cui non riusciste ad accertare in modo chiaro
              l&apos;eventuale presenza di un sintomo con le domande poste,
              oppure vi sentiste incerti riguardo alla valutazione di un
              sintomo, utilizzate l&apos;opzione &quot;?&quot;.
            </li>
          </ul>
        </FormInstructions>
        {step === 2 && (
          <p className="font-bold">
            Domande da porre alla fine dell&apos;intervista sui sintomi 1-17
          </p>
        )}
      </FormHeader>
      {step === 1 && (
        <>
          <section>
            <header className="sticky top-[128px] flex justify-between bg-white-900 py-4">
              <span className="self-center text-sm">Negli ultimi 6 mesi</span>
              <div className="flex">
                <ul className="flex gap-2 text-primary">
                  <li className="flex w-10 items-center justify-center text-sm">
                    Sì
                  </li>
                  <li className="flex w-10 items-center justify-center text-sm">
                    No
                  </li>
                  <li className="flex w-10 items-center justify-center text-sm">
                    ?
                  </li>
                </ul>
                <Separator orientation="vertical" className="mx-4" />
                <div className="flex flex-col items-center space-y-2">
                  <Label htmlFor="expand-all-one">Espandi tutto</Label>
                  <Switch
                    id="expand-all-one"
                    checked={isAllExpanded}
                    onCheckedChange={setExpandAll}
                  />
                </div>
              </div>
            </header>
            {QUETIONS_ONE.map((question) => {
              return (
                <ItemStepOne
                  key={question.index}
                  question={question}
                  expanded={expand[`item-${question.index}`] ?? false}
                  setExpand={setExpand}
                />
              );
            })}
          </section>
          <section>
            <header className="sticky top-[72px] flex justify-between bg-white-900 py-4">
              <span className="self-center text-sm">
                In qualche momento della vita
              </span>
              <div className="flex">
                <ul className="flex gap-2 text-primary">
                  <li className="flex w-10 items-center justify-center text-sm">
                    Sì
                  </li>
                  <li className="flex w-10 items-center justify-center text-sm">
                    No
                  </li>
                  <li className="flex w-10 items-center justify-center text-sm">
                    ?
                  </li>
                </ul>
                <Separator orientation="vertical" className="mx-4" />
                <div className="flex flex-col items-center space-y-2">
                  <Label htmlFor="expand-all-two">Espandi tutto</Label>
                  <Switch
                    id="expand-all-two"
                    checked={isAllExpanded}
                    onCheckedChange={setExpandAll}
                  />
                </div>
              </div>
            </header>
            {QUETIONS_TWO.map((question) => {
              return (
                <ItemStepOne
                  key={question.index}
                  question={question}
                  expanded={expand[`item-${question.index}`] ?? false}
                  setExpand={setExpand}
                />
              );
            })}
          </section>
        </>
      )}
      {step === 2 && (
        <section className="space-y-4">
          <ItemStepTwo />
        </section>
      )}
      <FormFooter type="eriraos-cl" className="justify-between">
        <Button type="button" onClick={() => prevStep()} disabled={step === 1}>
          Indietro
        </Button>
        {step === 2 ? (
          <FormSubmit form={form} onSubmit={onSubmit} />
        ) : (
          <Button type="button" onClick={() => nextStep()}>
            Avanti
          </Button>
        )}
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
