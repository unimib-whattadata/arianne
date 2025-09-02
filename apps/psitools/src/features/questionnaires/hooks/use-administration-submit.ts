import type { ReactQueryOptions } from '@arianne/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import type { CompilationData } from '@/features/questionnaires/components/form';
import { useAdministrationContext } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

interface Props<FormValues extends FieldValues & CompilationData> {
  mutationOptions?: ReactQueryOptions['administrations']['create'];
  formatRecords: (data: FormValues) => Record<string, unknown>;
  type: (typeof available)[number];
}

export const useAdministrationSubmit = <
  FormValues extends FieldValues & CompilationData,
>(
  props: Props<FormValues>,
) => {
  const { patient, isLoading } = usePatient();
  const { dispatch } = useAdministrationContext();

  const { mutationOptions, formatRecords, type } = props;

  const api = useTRPC();
  const queryClient = useQueryClient();

  const deafultOptions: ReactQueryOptions['administrations']['create'] = {
    onSuccess: async (data) => {
      dispatch({
        type: 'set_state',
        payload: {
          id: data.id,
          sent: true,
        },
      });
      await queryClient.invalidateQueries(
        api.patients.findUnique.queryFilter(),
      );
    },
    onError: () => {
      return toast.error(
        'Si è verificato un errore durante il caricamento della somministrazione, riprova più tardi.',
      );
    },
    onSettled: () => {
      dispatch({
        type: 'set_submitting',
        payload: {
          isSubmitting: false,
        },
      });
    },
  };

  const administration = useMutation(
    api.administrations.create.mutationOptions({
      ...deafultOptions,
      ...mutationOptions,
    }),
  );

  if (!patient || isLoading) return { onSubmit: undefined };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    dispatch({
      type: 'set_submitting',
      payload: {
        isSubmitting: true,
      },
    });

    const records = formatRecords(data);

    await administration.mutateAsync({
      patientId: patient.id,
      records,
      therapistName: data.therapistName,
      therapistLastname: data.therapistLastname,
      createdAt: data.createdAt,
      modality: data.modality,

      type,
    });
  };

  return { onSubmit };
};
