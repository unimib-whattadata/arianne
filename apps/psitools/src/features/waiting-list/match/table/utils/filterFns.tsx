import type { RouterOutputs } from '@arianne/api';
import type { medicalRecordParentStateEnum } from '@arianne/db/schema';
import type { FilterFn } from '@tanstack/react-table';

type State = (typeof medicalRecordParentStateEnum.enumValues)[number];
type Profile = RouterOutputs['profiles']['get'];

export const fuzzyFilter: FilterFn<unknown> = (row, id, value: string) => {
  const { getValue } = row;
  const profile = getValue<Profile>(id);
  if (!profile?.name) return false;

  const isValid =
    profile.name.toLowerCase().includes(value.toLowerCase()) ||
    profile.email.toLowerCase().includes(value.toLowerCase());
  return isValid;
};

export const stateFilter: FilterFn<unknown> = (row, id, value: string[]) => {
  if (value.length === 0) return true;
  const { getValue } = row;

  const state = getValue<State>(id);
  if (!state) return false;
  return value.includes(state);
};
