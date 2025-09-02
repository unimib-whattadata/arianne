'use client';

import { cn } from '@/utils/cn';

interface Props {
  prevScore: number;
  nextScore: number;
  label: string;
  statistics?: {
    avarage: number;
    standardDeviation: number;
  };
}

export const Chart = (props: Props) => {
  const { prevScore, nextScore, label } = props;

  const score = nextScore - prevScore;

  const getScoreColor = (): string => {
    if (score > 0) return 'bg-red-400';
    if (score < 0) return 'bg-green-400';
    return 'bg-green-400';
  };

  const formatScore = (): string => {
    if (score > 0) return `+${score}`;
    return score.toString();
  };

  const result = () => {
    if (score > 0) return 'peggiorata';
    if (score < 0) return 'migliorata';
    return 'stabile';
  };

  return (
    <div className="grid min-w-[132px] place-items-center space-y-2">
      <div>
        <p className="text-center font-bold">{label}</p>
        <p className="text-center">{result()}</p>
      </div>
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center self-center rounded-full p-4',
          getScoreColor(),
        )}
      >
        <span className={'relative -left-1 text-lg font-bold text-white'}>
          {formatScore()}
        </span>
      </div>
    </div>
  );
};
