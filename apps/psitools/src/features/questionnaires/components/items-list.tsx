import { Separator } from '@radix-ui/react-select';
import { Fragment } from 'react';

import { cn } from '@/utils/cn';

export type ItemsListQuestions = {
  /**
   * The unique identifier for the question.
   * Can be a string or a number.
   */
  id: string | number;

  /**
   * The text of the question.
   */
  text: string;

  /**
   * An optional value associated with the question.
   * Can be a React node or an object containing previous and next React nodes.
   */
  value?: React.ReactNode | { prev: React.ReactNode; next: React.ReactNode };
}[];

interface ItemsListProps {
  /**
   * An optional tuple of two numbers representing a range or comparison values.
   */
  T?: [number, number];

  /**
   * An array of questions to be displayed in the list.
   */
  questions: ItemsListQuestions;
  /**
   * Label
   */
  label?: React.ReactNode | string;
}

export const ItemsList = (props: ItemsListProps) => {
  const { questions, T, label } = props;

  const isComparison = questions.some(({ value }) => {
    return (
      typeof value === 'object' &&
      value !== null &&
      'next' in value &&
      'prev' in value
    );
  });

  const hasComparison = (
    value: unknown,
  ): value is {
    prev: React.ReactNode;
    next: React.ReactNode;
  } =>
    typeof value === 'object' &&
    value !== null &&
    'next' in value &&
    'prev' in value;

  return (
    <div
      className={cn(
        'relative grid grid-cols-[max-content,600px,fit-content(30ch)] items-center gap-2',
        isComparison &&
          'grid-cols-[max-content,600px,fit-content(30ch),fit-content(30ch)]',
      )}
    >
      <Separator className="absolute col-start-3 col-end-3 h-full w-px bg-slate-300" />
      {isComparison && (
        <Separator className="absolute col-start-4 col-end-4 h-full w-px bg-slate-300" />
      )}
      <span className="col-span-2 text-slate-500">{label || 'Domanda'}</span>
      {isComparison ? (
        <>
          <span className="col-start-3 col-end-4 flex justify-center px-2 text-slate-500">
            T{T?.[0]}
          </span>
          <span className="col-start-4 col-end-5 flex justify-center px-2 text-slate-500">
            T{T?.[1]}
          </span>
        </>
      ) : (
        <span
          className={`col-start-3 col-end-4 flex ${T ? 'justify-center' : 'ml-2'} px-2 text-slate-500`}
        >
          {T?.length ? `T${T[0]}` : 'Risposta'}
        </span>
      )}
      {questions.map(({ id, text, value }) => {
        return (
          <Fragment key={id}>
            <Separator
              className={cn(
                'col-span-3 h-px w-full bg-slate-300',
                isComparison && 'col-span-4',
              )}
            />
            <div className="col-span-2 grid grid-cols-subgrid gap-2">
              <span className="text-primary col-start-1 col-end-2">{id}.</span>
              <span className="col-start-2 col-end-3">{text}</span>
            </div>
            {hasComparison(value) ? (
              <>
                <div className="pl-2">{value.prev}</div>
                <div className="pl-2">{value.next}</div>
              </>
            ) : (
              <div className="pl-2">{value}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
