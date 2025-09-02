import { QUESTIONS } from '@/features/questionnaires/gaf-sofas/questions';

interface Props {
  score: number;
}

export const Details = (props: Props) => {
  const { score } = props;

  const item = QUESTIONS.find((item) => item.min <= score && item.max >= score);

  if (!item) return null;

  return (
    <div className="border-primary mt-4 w-[679px] rounded-md border bg-card p-4">
      <p className="font-bold">
        {item.min === 0 ? 0 : `${item.min} - ${item.max}`}
      </p>
      <p>{item.text}</p>
    </div>
  );
};
