export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
  const variance =
    numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    numbers.length;
  return +Math.sqrt(variance).toFixed(2);
}
