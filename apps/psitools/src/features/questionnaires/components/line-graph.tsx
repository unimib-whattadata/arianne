// Documentare i types
import { useEffect, useMemo, useRef } from 'react';

import { graphColors } from '@/features/questionnaires/settings';
import { cn } from '@/utils/cn';

export type LineGraphScore =
  | number
  | [{ score: number; T: number }, { score: number; T: number }];

interface LineGraphProps {
  /**
   * The scores to be displayed on the graph.
   * Can be a single number or an array of objects containing score and T values.
   */
  scores: LineGraphScore;

  /**
   * The maximum score value for the graph.
   */
  maxScore: number;

  /**
   * Optional label for the graph. It will be displayed above the graph.
   */
  label?: string;

  className?: string;

  /**
   * The ticks to be displayed on the graph.
   * Can be a single tick object or an array of tick objects.
   */
  ticks:
    | {
        /**
         * The cutoff value for the tick.
         */
        cutoff: number;
        /**
         * The label for the tick.
         */
        label: string;
        /**
         * Optional color for the tick.
         */
        color?: keyof typeof graphColors;
      }
    | {
        /**
         * The cutoff value for the tick.
         */
        cutoff: number;
        /**
         * The label for the tick.
         */
        label: string;
        /**
         * Optional color for the tick. Html entities are allowed.
         */
        color?: keyof typeof graphColors;
      }[];

  /**
   * Optional size for the graph. Default is 38 rem.
   */
  size?: number;
}

export const LineGraph = (props: LineGraphProps) => {
  const { scores, maxScore, label, ticks, size = 38 } = props;
  const tickLabelRefs = useRef<Map<number, HTMLParagraphElement>>(new Map());

  const isComparison = Array.isArray(scores);

  const scoresArr = isComparison
    ? scores.sort((a, b) => a.T - b.T)
    : [{ score: scores, T: null }];

  const normalizer = () => size / maxScore;

  const getColor = (scopedScore: number) => {
    const ticksArr = Array.isArray(ticks) ? ticks : [ticks];
    const sortedTicks = ticksArr.sort((a, b) => b.cutoff - a.cutoff);
    const tick = sortedTicks.find((tick) => scopedScore > tick.cutoff);
    if (!tick) return 'bg-emerald-400';
    return graphColors[tick.color ?? 'default'];
  };

  const ticksArr = useMemo(
    () => (Array.isArray(ticks) ? ticks : [ticks]),
    [ticks],
  );

  useEffect(() => {
    ticksArr.forEach((tick) => {
      const { cutoff } = tick;
      const currentTick = tickLabelRefs.current.get(cutoff);
      const lenght = currentTick?.offsetWidth ?? 0;
      currentTick?.style.setProperty('left', `-${lenght / 2}px`);
    });
  }, [ticksArr, tickLabelRefs]);

  const Ticks = () => {
    return ticksArr.map((tick, index) => {
      const { cutoff, label } = tick;
      const position = {
        height: isComparison ? 'h-20' : 'h-10',
        top: isComparison ? '-top-4' : '-top-2',
      };
      return (
        <div
          key={index}
          style={{ left: `${cutoff * normalizer()}rem` }}
          className={cn('absolute col-start-2 col-end-3', position.top)}
        >
          <div className={cn('w-[2px] rounded-md bg-black', position.height)} />
          <p
            ref={(ref) => {
              if (ref) {
                tickLabelRefs.current.set(cutoff, ref);
              }
            }}
            className="relative mt-4"
            dangerouslySetInnerHTML={{ __html: label }} // this allows to render html in the label
          />
        </div>
      );
    });
  };

  const Bar = ({
    score,
    T,
    indicatorPosition = 'top',
  }: {
    score: number;
    T: number | null;
    indicatorPosition?: 'top' | 'bottom';
  }) => (
    <>
      {T !== null ? (
        <span className="text-primary font-bold">T{T}</span>
      ) : (
        <span className="text-primary font-bold">
          {score}/{maxScore}
        </span>
      )}
      <div
        style={{ width: `${size}rem` }}
        className="relative h-4 rounded-md bg-gray-300"
      >
        <div className="absolute bottom-0 left-0 flex items-end justify-end">
          <div
            style={{ width: `${score * normalizer()}rem` }}
            className={cn('h-4 rounded-s-md', getColor(score))}
          />
          <div
            className={cn(
              'h-10 w-[2px] rounded-md text-white',
              indicatorPosition === 'bottom' && 'relative top-6',
              getColor(score),
            )}
          />
          <span
            className={cn(
              'relative -left-[17px] -top-6 flex h-8 w-8 items-center justify-center rounded-full leading-none text-white',
              indicatorPosition === 'bottom' && 'top-10',
              getColor(score),
            )}
          >
            {score}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <span className="font-bold">{label}</span>
      <div className="relative my-10 grid grid-cols-[max-content_1fr] items-center gap-x-4">
        <Bar score={scoresArr[0].score} T={scoresArr[0].T} />
        {isComparison && (
          <Bar
            score={scoresArr[1].score}
            T={scoresArr[1].T}
            indicatorPosition="bottom"
          />
        )}

        <Ticks />
      </div>
    </div>
  );
};
