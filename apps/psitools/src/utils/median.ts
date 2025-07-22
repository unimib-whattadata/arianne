export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('The array is empty.');
  }

  if (numbers.length === 1 && numbers[0] !== undefined) {
    return numbers[0];
  }

  numbers.sort((a, b) => a - b);

  const mid = Math.floor(numbers.length / 2);

  const midValue = numbers[mid];
  const midValueMinusOne = numbers[mid - 1];

  if (midValue === undefined || midValueMinusOne === undefined) {
    throw new Error('The median is undefined');
  }

  if (numbers.length % 2 === 0) {
    return +((midValueMinusOne + midValue) / 2).toFixed(2);
  } else {
    return +midValue.toFixed(2);
  }
}
