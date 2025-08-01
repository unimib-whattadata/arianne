import React from 'react';

import { cn } from '@/utils/cn';

interface Props {
  title: string;
  score: number;
}

export const SingleLabel = (props: Props) => {
  const { title, score } = props;

  return (
    <div className="m-auto flex min-w-44 flex-col justify-center p-6">
      <h1 className="pr-1 text-center text-base font-normal">{title} </h1>

      <div className="flex h-16 w-16 items-center justify-center self-center rounded-full bg-emerald-500 p-4">
        <span
          className={cn(
            'relative flex justify-center text-lg font-bold text-white',
          )}
        >
          {score}
        </span>
      </div>
    </div>
  );
};
