export type ScoreKey =
  | 'affettivita'
  | 'distacco'
  | 'antagonismo'
  | 'disinibizione'
  | 'psicoticismo';

const DOMAIN_MAP: Record<
  string,
  { label: string; scoreKey: ScoreKey; id: number[]; maxScore: number }[]
> = {
  domini: [
    {
      label: 'Affettività negativa',
      scoreKey: 'affettivita',
      id: [8, 9, 10, 11, 15],
      maxScore: 15,
    },
    {
      label: 'Distacco',
      scoreKey: 'distacco',
      id: [4, 13, 14, 16, 18],
      maxScore: 15,
    },
    {
      label: 'Antagonismo',
      scoreKey: 'antagonismo',
      id: [17, 19, 20, 22, 25],
      maxScore: 15,
    },
    {
      label: 'Disinibizione',
      scoreKey: 'disinibizione',
      id: [21, 2, 3, 5, 6],
      maxScore: 15,
    },
    {
      label: 'Psicoticismo',
      scoreKey: 'psicoticismo',
      id: [7, 12, 21, 23, 24],
      maxScore: 15,
    },
  ],
};

export default DOMAIN_MAP;
