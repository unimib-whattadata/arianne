'use client';

import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import { QUESTIONS } from '@/features/questionnaires/dass-21/questions';
import { cn } from '@/utils/cn';

const Value = ({
  value,
  currentValue,
  otherValue,
}: {
  value: string;
  currentValue: string;
  otherValue: string;
}) => {
  const isWorse = parseInt(currentValue) > parseInt(otherValue);

  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span>
        <p
          className={cn(
            'flex rounded-md px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {value}
        </p>
      </span>
    </div>
  );
};

const RESPONSES_DICT = {
  0: 'Non mi è mai accaduto',
  1: 'Mi è capitato qualche volta',
  2: 'Mi è capitato con una certa frequenza',
  3: 'Mi è capitato spesso',
} as const;

interface Props {
  prevResponse: Record<string, string>;
  nextResponse: Record<string, string>;
  prevT: number;
  nextT: number;
}

export const DetailsList = (props: Props) => {
  const { prevResponse, nextResponse, prevT, nextT } = props;

  const prevItems = Object.entries(prevResponse).map(([key, response]) => {
    return {
      id: key.split('-')[1],
      index: +key.split('-')[1] - 1,
      response: parseInt(response) as 0 | 1 | 2 | 3,
    };
  });

  const nextItems = Object.entries(nextResponse).map(([key, response]) => {
    return {
      id: key.split('-')[1],
      index: +key.split('-')[1] - 1,
      response: parseInt(response) as 0 | 1 | 2 | 3,
    };
  });

  return (
    <div className="-mb-px grid grid-cols-[1fr,auto,auto,auto,auto] items-center">
      <p className="p-4 font-bold">Elenco item</p>
      <Separator orientation="vertical" className="mx-4" />
      <p className="font-bold">Risposte T{prevT}</p>
      <Separator orientation="vertical" className="mx-4" />
      <p className="pr-4 font-bold">Rispsote T{nextT}</p>
      <Separator className="col-span-5" />

      {prevItems.map((prevItem) => {
        const nextItem = nextItems.find((item) => item.id === prevItem.id);
        if (!nextItem) return null;

        return (
          <Fragment key={prevItem.id}>
            <div className="grid h-14 grid-cols-[auto,1fr] items-center gap-2 pl-4 text-sm">
              <span className="text-primary">
                {QUESTIONS[prevItem.index]?.id}
              </span>
              <span>{QUESTIONS[prevItem.index]?.text}</span>
            </div>

            <Separator orientation="vertical" className="mx-4" />
            <div className="flex w-24 items-center justify-start pr-4 text-sm">
              <Value
                value={RESPONSES_DICT[prevItem.response]}
                currentValue={prevItem.response.toString()}
                otherValue={nextItem.response.toString()}
              />
            </div>

            <Separator orientation="vertical" className="mx-4" />
            <div className="flex w-24 items-center justify-start pr-4 text-sm">
              <Value
                value={RESPONSES_DICT[nextItem.response]}
                currentValue={nextItem.response.toString()}
                otherValue={prevItem.response.toString()}
              />
            </div>

            <Separator className="col-span-5 last:hidden" />
          </Fragment>
        );
      })}
    </div>
  );
};
