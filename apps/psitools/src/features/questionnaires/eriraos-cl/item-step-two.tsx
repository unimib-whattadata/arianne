'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

import type { FormValues } from './schema';
import { SYMPTOMS } from './symptoms';

export interface Props {
  defaultValue?: {
    'post-question-symptom'?: string;
    'post-question-1': string;
    'post-question-2': string;
  };
}
export const ItemStepTwo = (props: Props) => {
  const { defaultValue } = props;
  const form = useFormContext<FormValues>();

  return (
    <>
      <div className="rounded-md bg-white p-4 transition-colors duration-300">
        <FormLabel>
          <div className="space-y-2 pb-2">
            <h3 className="text-base text-space-gray">
              C&apos;è qualche problema, tra quelli di cui abbiamo parlato, che
              ti disturba particolarmente? Quale?
            </h3>
            <p className="text-slate-500">
              Descrivetelo brevemente di seguito, citando se possibile il numero
              del sintomo
            </p>
          </div>

          <FormField
            control={form.control}
            name="response.post.post-question-symptom"
            defaultValue={defaultValue?.['post-question-symptom']}
            render={({ field }) => {
              return (
                <FormItem className="w-full pb-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!defaultValue?.['post-question-symptom']}
                  >
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Seleziona il sintomo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="top-4 h-36">
                      {SYMPTOMS.map((symptom, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {index + 1}. {symptom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="-mb-2 mt-2" />
                </FormItem>
              );
            }}
          />
        </FormLabel>

        <FormField
          control={form.control}
          name="response.post.post-question-1"
          defaultValue={defaultValue?.['post-question-1']}
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!!defaultValue?.['post-question-1']}
                    className={cn(
                      'rounded-md border border-white bg-input p-4 transition-colors duration-300',
                      field.value ? 'border-primary' : 'border-white',
                    )}
                    placeholder="Descrizione..."
                  />
                </FormControl>
                <FormMessage className="-mb-2 mt-2" />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="rounded-md bg-white p-4 transition-colors duration-300">
        <FormLabel>
          <div className="space-y-2 pb-2">
            <h3 className="text-base text-space-gray">
              Questo problema è peggiorato negli ultimi sei mesi?
            </h3>
            <p className="text-slate-500">
              Seleziona la risposta che ritieni più appropriata
            </p>
          </div>
        </FormLabel>

        <FormField
          control={form.control}
          name="response.post.post-question-2"
          defaultValue={defaultValue?.['post-question-2']}
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormControl>
                  <RadioGroup
                    disabled={!!defaultValue?.['post-question-2']}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="chiaramente"
                          className="text-primary"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Chiaramente peggiorato
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="leggermente"
                          className="text-primary"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Leggermente peggiorato
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="nessuno"
                          className="text-primary"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Nessun cambiamento o peggioramento
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="-mb-2 mt-2" />
              </FormItem>
            );
          }}
        />
      </div>
    </>
  );
};
