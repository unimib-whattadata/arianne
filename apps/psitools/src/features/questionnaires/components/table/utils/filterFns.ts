import type { FilterFn } from '@tanstack/react-table';

export const dateFilter: FilterFn<unknown> = (
  _row,
  _id,
  _value: string,
): boolean => {
  return true;
};
