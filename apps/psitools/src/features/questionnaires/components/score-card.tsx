import { cn } from '@/utils/cn';

const COLOR_MAP = {
  danger: 'bg-red-400',
  warning: 'bg-yellow-400',
  default: 'bg-emerald-400',
};

interface ComparisonText {
  positive: string;
  negative: string;
  indifferent: string;
}

interface Comparison {
  label: string;
  score: [number, number];
  baseText: string;
  comparisonText: ComparisonText;
  className?: string;
  children?: React.ReactNode;
  opposite?: string;
}
interface Single {
  label: string;
  score: number;
  cutoff?: number;
  className?: string;
  children?: React.ReactNode;
}
type Props = Single | Comparison;

function isComparison(props: Props): props is Comparison {
  return Array.isArray(props.score);
}

export const ScoreCard = (props: Props) => {
  const getDifferenceBgColor = (score: number) => {
    if (isComparison(props)) {
      if (score > 0) return COLOR_MAP.danger;
      if (score < 0) return COLOR_MAP.default;
      return COLOR_MAP.warning;
    }

    if (props.cutoff) {
      if (score > props.cutoff) return COLOR_MAP.danger;
      if (score < props.cutoff) return COLOR_MAP.default;
      return COLOR_MAP.warning;
    }

    return COLOR_MAP.default;
  };
  const getScore = (score: number | [number, number]) => {
    if (Array.isArray(score)) {
      return score[1] - score[0];
    }

    return score;
  };

  // const displayScore = (score: number | [number, number]) => {
  //   const roundToTwoDecimals = (num: number) => parseFloat(num.toFixed(2));
  //   if (Array.isArray(score)) {
  //     const difference = score[1] - score[0];
  //     const roundedDifference = roundToTwoDecimals(difference);
  //     return roundedDifference > 0
  //       ? +${roundedDifference}
  //       : roundedDifference;
  //   }
  //   return roundToTwoDecimals(score);
  // };

  const displayScore = (score: number | [number, number]) => {
    if (Array.isArray(score)) {
      const difference = score[1] - score[0];
      return difference > 0
        ? `+${difference.toFixed(2)}`
        : difference.toFixed(2);
    }
    return score;
  };

  const getDifferenceText = ({
    difference,
    comparisonText,
  }: {
    difference: number;
    comparisonText: ComparisonText;
  }) => {
    if (difference > 0) return comparisonText.positive;
    if (difference < 0) return comparisonText.negative;
    return comparisonText.indifferent;
  };

  return (
    <div
      className={cn(
        'm-auto flex min-w-[11rem] flex-col justify-end space-y-2 p-6',
        props.className,
      )}
    >
      {isComparison(props) ? (
        <>
          <h1 className="justify-self-start pb-1 text-center text-base font-bold">
            {props.baseText}
          </h1>
          <span className="pb-3 text-center text-sm font-semibold">
            {getDifferenceText({
              difference: getScore(props.score),
              comparisonText: props.comparisonText,
            })}
          </span>
        </>
      ) : (
        <span className="mb-auto pb-4 text-center font-bold">
          {props.label}
        </span>
      )}
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center self-center rounded-full p-4',
          getDifferenceBgColor(getScore(props.score)),
        )}
      >
        <span
          className={cn(
            'relative flex justify-center text-[20px] font-bold text-white',
            getScore(props.score) !== 0,
          )}
        >
          {displayScore(props.score)}
        </span>
      </div>
      {props.children}
    </div>
  );
};
