import { cn } from '@/utils/cn';

interface Props {
  label: 'Depressione' | 'Ansia' | 'Stress' | 'Distress generale';
  score: number;
}

const SIZE = 47;

export const Graph = (props: Props) => {
  const { score, label } = props;

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
          className="absolute -top-3"
        >
          <div className="h-10 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-4">Normale</p>
        </div>
        <div
          style={{ left: `${ticks.mild * normalizer()}rem` }}
          className="absolute -top-3"
        >
          <div className="h-10 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-4">Lieve</p>
        </div>
        <div
          style={{ left: `${ticks.moderate * normalizer()}rem` }}
          className="absolute -top-8"
        >
          <div className="h-20 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-7">Moderato</p>
        </div>
        <div
          style={{ left: `${ticks.severe * normalizer()}rem` }}
          className="absolute -top-3"
        >
          <div className="h-10 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-2">Grave</p>
        </div>
        <div
          style={{ left: `${ticks.extremelySevere * normalizer()}rem` }}
          className="absolute -top-3"
        >
          <div className="h-10 w-[2px] rounded-md bg-black"></div>
          <p className="relative -left-2">Molto grave</p>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="flex items-center space-x-2 font-bold">
        <span>{label}</span>
        <small className="bg-primary rounded-full px-2 py-0.5 text-white">
          {score}/{label === 'Distress generale' ? '126' : '42'}
        </small>
      </div>
      {!(label === 'Distress generale') && (
        <small>cutt-off = {ticks.moderate}</small>
      )}
      <div>
        <div
          style={{ width: `${SIZE}rem` }}
          className="relative my-12 h-4 rounded-md bg-gray-300"
        >
          <div className="absolute bottom-0 left-0 flex items-end justify-end">
            <div
              style={{ width: `${score * normalizer()}rem` }}
              className={cn('h-4 rounded-s-md', getColor(score))}
            ></div>
            <div
              className={cn(
                'h-10 w-[2px] rounded-md text-white',
                getColor(score),
              )}
            ></div>
            <span
              className={cn(
                'relative -left-4 -top-6 flex h-8 w-8 items-center justify-center rounded-full leading-none text-white',
                getColor(score),
              )}
            >
              {score}
            </span>
          </div>

          {makeTicks()}
        </div>
      </div>
    </div>
  );
};
