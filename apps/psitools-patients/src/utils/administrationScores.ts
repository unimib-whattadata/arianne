import { TRPCError } from '@trpc/server';

const ansiaKeys: number[] = [
  1, 12, 14, 18, 23, 31, 44, 45, 46, 54, 57, 64, 67, 73,
];
const benessereKeys: number[] = [
  2, 4, 11, 22, 28, 41, 42, 50, 51, 55, 56, 59, 63, 76, 78,
];
const cambiamentoKeys: number[] = [16, 21, 27, 30, 40, 43, 53, 58, 60, 71, 80];
const depressioneKeys: number[] = [
  7, 10, 13, 17, 19, 25, 26, 32, 37, 38, 47, 49, 52, 61, 65, 66, 68, 69, 72,
];
const disagioKeys: number[] = [
  3, 5, 6, 8, 9, 15, 20, 24, 29, 33, 34, 35, 36, 39, 48, 62, 70, 74, 75, 77, 79,
];

const somma = (k: number, v: number) => {
  let s = 0;
  const invertiti = [7, 37, 44, 58];
  if (k in invertiti) {
    s += 4 - v;
  } else {
    s += v;
  }
  return s;
};

const totalScore = (
  records: Record<string, string>,
  patologiaKeys: number[],
): number => {
  let total = 0;
  patologiaKeys.forEach((key) => {
    const item = `item-${key}`;
    const value = records[item];

    if (value === undefined)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `item ${item} not found in records`,
      });

    total += somma(key, parseInt(value));
  });
  return total;
};

export const getScores = (
  records: Record<string, string>,
): {
  ansia: number;
  benessere: number;
  cambiamento: number;
  depressione: number;
  disagio: number;
} => {
  const ansia = totalScore(records, ansiaKeys);
  const benessere = totalScore(records, benessereKeys);
  const cambiamento = totalScore(records, cambiamentoKeys);
  const depressione = totalScore(records, depressioneKeys);
  const disagio = totalScore(records, disagioKeys);

  return {
    ansia: ansia,
    benessere: benessere,
    cambiamento: cambiamento,
    depressione: depressione,
    disagio: disagio,
  };
};
