import type { FormValues } from '@/features/questionnaires/gaf-sofas/item';
import { QUESTIONS } from '@/features/questionnaires/gaf-sofas/questions';

interface Props {
  prevResponse: FormValues['response'];
  nextResponse: FormValues['response'];
  prevT: number;
  nextT: number;
}

export const Details = (props: Props) => {
  const { prevResponse, nextResponse, prevT, nextT } = props;

  const prevScore = prevResponse.value[0];
  const nextScore = nextResponse.value[0];

  if (!prevScore || !nextScore) return null;

  const prevItem = QUESTIONS.find(
    (item) => item.min <= prevScore && item.max >= prevScore,
  );
  const nextItem = QUESTIONS.find(
    (item) => item.min <= nextScore && item.max >= nextScore,
  );

  if (!prevItem || !nextItem) return null;

  return (
    <div className="mt-4 grid w-[644px] grid-cols-[min-content_1fr] place-items-start gap-4">
      <span className="text-primary">T{prevT}</span>
      <div className="border-primary rounded-md border bg-card p-4">
        <p className="font-bold">
          {prevItem.min === 0 ? 0 : `${prevItem.min} - ${prevItem.max}`}
        </p>
        <p>{prevItem.text}</p>
      </div>

      <span className="text-primary">T{nextT}</span>
      <div className="border-primary rounded-md border bg-card p-4">
        <p className="font-bold">
          {nextItem.min === 0 ? 0 : `${nextItem.min} - ${nextItem.max}`}
        </p>
        <p>{nextItem.text}</p>
      </div>
    </div>
  );
};
