'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

import type { QUESTIONS } from './questions';
import type { FormValues } from './schema';

interface Props {
  question: (typeof QUESTIONS)[number];
  defaultValue?: string;
  defaultNote?: string;
}

export const Item2 = (props: Props) => {
  const { question, defaultValue, defaultNote } = props;
  const { index } = question;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      defaultValue={defaultNote ?? ''}
      name={`response.notes.note-${index}`}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'mb-2 flex flex-col rounded-md border border-white bg-white p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-gray-10',
            )}
          >
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center rounded-md transition-colors duration-300">
              <FormLabel>
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <span className="text-slate-500">{question.index}.</span>
                  <span className="text-space-gray">{`${question.text}`}</span>
                </div>
              </FormLabel>
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    disabled={!!defaultValue}
                    {...field}
                    value={defaultValue || field.value || ''}
                    className={cn(
                      'ml-2 rounded-md border border-white bg-input p-2 transition-colors duration-300',
                      field.value ? 'border-primary' : 'border-white',
                    )}
                    placeholder="Note"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        );
      }}
    />
  );
};
