import { cn } from '@/utils/cn';

const SIZE = 45;

interface Props {
  prevScore: number;
  nextScore: number;
  prevT: number;
  nextT: number;
  label: 'Distress generale' | 'Depressione' | 'Ansia' | 'Stress';
  statistics?: {
    avarage: number;
    standardDeviation: number;
  };
}

export const Graph = (props: Props) => {
  const { prevScore, nextScore, prevT, nextT, label } = props;

  const normalizer = () => {
    if (label === 'Distress generale') return SIZE / 126;
    return SIZE / 42;
  };

  const getColor = (score: number): string => {
    if (label === 'Depressione') {
      if (score < 10) return 'bg-green-400';
      if (score < 14) return 'bg-yellow-400';
      if (score < 21) return 'bg-orange-400';
      return 'bg-red-400';
    }

    if (label === 'Ansia') {
      if (score < 8) return 'bg-green-400';
      if (score < 10) return 'bg-yellow-400';
      if (score < 15) return 'bg-orange-400';
      return 'bg-red-400';
    }

    if (label === 'Stress') {
      if (score < 15) return 'bg-green-400';
      if (score < 19) return 'bg-yellow-400';
      if (score < 26) return 'bg-orange-400';
      return 'bg-red-400';
    }

    return 'bg-primary';
  };

  const ticks: {
    normal: number;
    mild: number;
    moderate: number;
    severe: number;
    extremelySevere: number;
  } = {
    normal: 0,
    mild: 0,
    moderate: 0,
    severe: 0,
    extremelySevere: 0,
  };

  if (label === 'Depressione') {
    ticks.normal = 0;
    ticks.mild = 10;
    ticks.moderate = 14;
    ticks.severe = 21;
    ticks.extremelySevere = 28;
  }

  if (label === 'Ansia') {
    ticks.normal = 0;
    ticks.mild = 8;
    ticks.moderate = 10;
    ticks.severe = 15;
    ticks.extremelySevere = 20;
  }

  if (label === 'Stress') {
    ticks.normal = 0;
    ticks.mild = 15;
    ticks.moderate = 19;
    ticks.severe = 26;
    ticks.extremelySevere = 34;
  }

  const makeTicks = () => {
    if (label === 'Distress generale') return null;

    return (
      <>
        <div
          style={{ left: `${ticks.normal * normalizer()}rem` }}
          className="absolute -top-12"
        >
          <div className="h-20 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-4">Normale</p>
        </div>
        <div
          style={{ left: `${ticks.mild * normalizer()}rem` }}
          className="absolute -top-12"
        >
          <div className="h-20 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-4">Lieve</p>
        </div>
        <div
          style={{ left: `${ticks.moderate * normalizer()}rem` }}
          className="absolute -top-16"
        >
          <div className="h-28 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-7">Moderato</p>
        </div>
        <div
          style={{ left: `${ticks.severe * normalizer()}rem` }}
          className="absolute -top-12"
        >
          <div className="h-20 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-2">Grave</p>
        </div>
        <div
          style={{ left: `${ticks.extremelySevere * normalizer()}rem` }}
          className="absolute -top-12"
        >
          <div className="h-20 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-2">Molto grave</p>
        </div>
      </>
    );
  };

  return (
    <div className="relative">
      <span className="font-bold">{label}</span>
      <div className="my-10 space-y-4">
        <div className="grid grid-cols-[1rem,1fr] place-items-center gap-4">
          <span className="text-primary">T{prevT}</span>
          <div
            style={{ width: `${SIZE}rem` }}
            className="relative h-4 rounded-md bg-gray-300"
          >
            <div className="absolute bottom-0 left-0 flex items-end justify-end">
              <div
                style={{ width: `${prevScore * normalizer()}rem` }}
                className={cn('h-4 rounded-s-md', getColor(prevScore))}
              ></div>
              <div
                className={cn(
                  'h-10 w-[2px] rounded-md text-white',
                  getColor(prevScore),
                )}
              ></div>
              <span
                className={cn(
                  'relative -left-4 -top-6 flex h-8 w-8 items-center justify-center rounded-full leading-none text-white',
                  getColor(prevScore),
                )}
              >
                {prevScore}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1rem,1fr] place-items-center gap-4">
          <span className="text-primary">T{nextT}</span>
          <div
            style={{ width: `${SIZE}rem` }}
            className="relative h-4 rounded-md bg-gray-300"
          >
            <div className="absolute bottom-0 left-0 flex items-end justify-end">
              <div
                style={{ width: `${nextScore * normalizer()}rem` }}
                className={cn('h-4 rounded-s-md', getColor(nextScore))}
              ></div>
              <div
                className={cn(
                  'relative top-6 h-10 w-[2px] rounded-md text-white',
                  getColor(nextScore),
                )}
              ></div>
              <span
                className={cn(
                  'relative -left-4 top-10 flex h-8 w-8 items-center justify-center rounded-full leading-none text-white',
                  getColor(nextScore),
                )}
              >
                {nextScore}
              </span>
            </div>

            {makeTicks()}
          </div>
        </div>
      </div>
    </div>
  );
};
