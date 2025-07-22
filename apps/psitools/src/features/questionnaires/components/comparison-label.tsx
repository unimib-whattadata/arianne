import React from 'react';

import { cn } from '@/utils/cn';

interface Props {
  next: number;
  prev: number;
  baseText: string;
  comparisonText: {
    positive: string;
    negative: string;
    indifferent: string;
  };
}

export const ComparisonLabels = (props: Props) => {
  const { prev, next, baseText } = props;
  const difference = next - prev;

  const getDifferenceBgColor = (difference: number) => {
    if (difference > 0) return 'bg-red-400';
    if (difference < 0) return 'bg-emerald-500';
    return 'bg-yellow-400';
  };

  const getDifferenceScore = (difference: number) => {
    if (difference > 0) return `+${difference}`;
    return difference;
  };

  const getDifferenceText = (difference: number) => {
    if (difference > 0) return props.comparisonText.positive;
    if (difference < 0) return props.comparisonText.negative;
    return props.comparisonText.indifferent;
  };

  return (
    <div className="m-auto flex min-w-[11rem] flex-col justify-center p-6">
      <h1 className="pr-1 text-center text-base font-normal">{baseText} </h1>
      <span className="pb-3 text-center font-semibold">
        {getDifferenceText(difference)}
      </span>

      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center self-center rounded-full p-4',
          getDifferenceBgColor(difference),
        )}
      >
        <span
          className={cn(
            'relative flex justify-center text-lg font-bold text-white',
            getDifferenceScore(difference) !== 0 && '-left-1',
          )}
        >
          {getDifferenceScore(difference)}
        </span>
      </div>
    </div>
  );
};
