'use client';

import { ChevronDown } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

import type { QUESTIONS } from './questions';
import type { FormValues } from './schema';

interface Props {
  question: (typeof QUESTIONS)[number];
  defaultValue?: string;
  defaultNote?: string;
  expanded: boolean;
  setExpand: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export const ItemStepOne = (props: Props) => {
  const { question, defaultValue, defaultNote, expanded, setExpand } = props;

  const form = useFormContext<FormValues>();

  return (
    <Collapsible
      className="mb-2 grid space-y-3 rounded-md border-white bg-white p-4"
      open={expanded}
      onOpenChange={(open) =>
        setExpand((prev) => {
          return {
            ...prev,
            [`item-${question.index}`]: open,
          };
        })
      }
    >
      <div className="grid grid-cols-[1fr,auto,auto,auto] items-center rounded-md transition-colors duration-300">
        <FormLabel>
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <span className="text-slate-500">{question.index}.</span>
            <span className="text-space-gray">{`${question.text}`}</span>
          </div>
        </FormLabel>
        <FormField
          control={form.control}
          defaultValue={defaultValue ?? ''}
          name={`response.items.item-${question.index}.value`}
          render={({ field }) => {
            return (
              <FormItem className="flex items-center justify-end space-y-0">
                <FormControl>
                  <RadioGroup
                    disabled={!!defaultValue}
                    orientation="horizontal"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="mt-0 flex shrink-0"
                  >
                    <FormItem className="text-primary-400 flex w-10 items-center justify-center space-x-3">
                      <FormControl>
                        <RadioGroupItem
                          value="sì"
                          className="border-primary disabled:opacity-100"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="text-primary-400 flex w-10 items-center justify-center space-x-3">
                      <FormControl>
                        <RadioGroupItem
                          value="no"
                          className="border-primary disabled:opacity-100"
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="text-primary-400 flex w-10 items-center justify-center space-x-3">
                      <FormControl>
                        <RadioGroupItem
                          value="uncertain"
                          className="border-primary disabled:opacity-100"
                        />
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Separator orientation="vertical" className="ml-4 mr-14" />
        <CollapsibleTrigger>
          <ChevronDown className="h-6 w-6 text-slate-500" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <small className="block">{question.helpText}</small>
        {question.example && (
          <small className="italic">Esempi: {question.example}</small>
        )}
      </CollapsibleContent>
      <FormField
        control={form.control}
        defaultValue={defaultNote ?? ''}
        name={`response.items.item-${question.index}.note`}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  disabled={!!defaultValue}
                  {...field}
                  className={cn(
                    'rounded-md border border-white bg-input p-4 transition-colors duration-300',
                    field.value ? 'border-primary' : 'border-white',
                  )}
                  placeholder="Note"
                />
              </FormControl>
            </FormItem>
          );
        }}
      />
      <FormMessage className="-mb-2 mt-2" />
    </Collapsible>
  );
};
