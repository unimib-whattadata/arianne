'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  reverse?: boolean;
}

export const ComparisonCards = (props: Props) => {
  const { prev, next, baseText, reverse } = props;
  const difference = next - prev;

  const getDifferenceBgColor = (difference: number) => {
    if (reverse) {
      if (difference > 0) return 'bg-emerald-500';
      if (difference < 0) return 'bg-red-400';
    } else {
      if (difference > 0) return 'bg-red-400';
      if (difference < 0) return 'bg-emerald-500';
    }
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
    <Card
      className={cn(
        'relative flex h-full w-48 flex-col items-center transition-all duration-300',
      )}
    >
      <CardHeader className="space-y-0 p-4 pb-0">
        <CardTitle className="pr-1 text-center text-base font-normal">
          {baseText}{' '}
          <span className="font-semibold">{getDifferenceText(difference)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center self-center rounded-full p-4',
            getDifferenceBgColor(difference),
          )}
        >
          <span
            className={cn(
              'relative text-lg font-bold text-white',
              getDifferenceScore(difference) !== 0 && '-left-1',
            )}
          >
            {getDifferenceScore(difference)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
