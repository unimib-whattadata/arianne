import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import { QUESTIONS } from '@/features/questionnaires/dass-21/questions';

const RESPONSES_DICT = {
  0: 'Non mi è mai accaduto',
  1: 'Mi è capitato qualche volta',
  2: 'Mi è capitato con una certa frequenza',
  3: 'Mi è capitato spesso',
} as const;

interface Props {
  responses: Record<string, string>;
}

export const DetailsList = (props: Props) => {
  const { responses } = props;

  const items = Object.entries(responses).map(([index, response]) => {
    return [
      +index.split('-')[1] - 1,
      parseInt(response) as 0 | 1 | 2 | 3,
    ] as const;
  });

  return (
    <div className="-mb-px grid grid-cols-[1fr_auto_auto] items-center">
      <p className="p-4 font-bold">Elenco item</p>
      <Separator orientation="vertical" className="mx-4" />
      <p className="pr-4 font-bold">Risposte</p>
      <Separator className="col-span-3" />
      {items.map(([index, response]) => (
        <Fragment key={index}>
          <div className="grid h-14 grid-cols-[auto_1fr] items-center gap-2 pl-4 text-sm">
            <span className="text-primary">{QUESTIONS[index]?.id}</span>
            <span>{QUESTIONS[index]?.text}</span>
          </div>

          <Separator orientation="vertical" className="mx-4" />

          <div className="flex w-36 items-center justify-start pr-4 text-sm">
            {RESPONSES_DICT[response]}
          </div>

          <Separator className="col-span-3 last:hidden" />
        </Fragment>
      ))}
    </div>
  );
};
