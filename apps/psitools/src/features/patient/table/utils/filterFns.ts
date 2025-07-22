import type { MedicalRecord, User } from '@prisma/client';
import type { FilterFn } from '@tanstack/react-table';

export const fuzzyFilter: FilterFn<unknown> = (row, id, value: string) => {
  const { getValue } = row;
  const user = getValue<User>(id);
  if (!user.name) return false;

  const isValid =
    user.name.toLowerCase().includes(value.toLowerCase()) ||
    user.email.toLowerCase().includes(value.toLowerCase());
  return isValid;
};

export const stateFilter: FilterFn<unknown> = (row, id, value: string[]) => {
  if (value.length === 0) return true;
  const { getValue } = row;

  const state = getValue<MedicalRecord['state']>(id);
  if (!state) return false;
  return value.includes(state);
};
