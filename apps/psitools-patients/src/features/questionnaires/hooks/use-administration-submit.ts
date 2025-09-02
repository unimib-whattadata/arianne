import type { ReactQueryOptions } from '@arianne/api';
import type { Prisma } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import { useAdministrationContext } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';
import { useTRPC } from '@/trpc/react';

interface Props<FormValues extends FieldValues> {
  mutationOptions?: ReactQueryOptions['administration']['create'];
  formatRecords: (
    data: FormValues,
  ) => Prisma.NullTypes.JsonNull | Prisma.InputJsonValue;
  type: (typeof available)[number];
}

export const useAdministrationSubmit = <FormValues extends FieldValues>(
  props: Props<FormValues>,
) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: patient, isLoading } = useQuery(api.patient.get.queryOptions());
  const { dispatch } = useAdministrationContext();

  const { mutationOptions, formatRecords, type } = props;

  const deafultOptions: ReactQueryOptions['administration']['create'] = {
    onSuccess: async (data) => {
      toast.success('Somministrazione caricata con successo');
      dispatch({
        type: 'set_state',
        payload: {
          id: data.id,
          sent: true,
        },
      });
      await queryClient.invalidateQueries(api.assignments.get.queryFilter());
      router.replace('/');
    },
    onError: (error) => {
      console.log('>>> Error', error);
      return toast.error(
        'Si è verificato un errore durante il caricamento della somministrazione, riprova più tardi',
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
    api.administration.create.mutationOptions({
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

    const therapist = await queryClient.fetchQuery(
      api.therapist.get.queryOptions({
        id: patient.therapistId!,
      }),
    );

    await administration.mutateAsync({
      data: {
        therapistName: therapist.user!.firstName,
        therapistLastname: therapist.user!.lastName,
        modality: 'autonoma_presenza',
        createdAt: new Date(),
        date: new Date(),
        patientId: patient.id,
        records,
        type,
        medicalRecord: {
          connectOrCreate: {
            where: {
              patientId: patient.id,
            },
            create: {
              patientId: patient.id,
            },
          },
        },
      },
    });
  };

  return { onSubmit };
};
