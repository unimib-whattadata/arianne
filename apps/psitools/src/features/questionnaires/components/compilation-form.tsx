'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';
import { Calendar1Icon } from 'lucide-react';
import type { SubmitErrorHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

const formSchema = z.object({
  therapistName: z.string().min(1, { message: 'Nome è obbligatorio' }),
  therapistlastName: z.string().min(1, { message: 'Cognome è obbligatorio' }),
  modality: z.enum(['autonoma_presenza', 'intervista', 'accompagnatore']),
  date: z.date(),
  time: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface CompilationFormProps {
  administrationId: string;
  onFormComplete: (queryString: string) => void;
}

export default function CompilationForm({
  administrationId,
  onFormComplete,
}: CompilationFormProps) {
  const { patient } = usePatient();
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: tValueData } = useQuery(
    api.export.getTValue.queryOptions(
      {
        patientId: patient?.id || '',
        type: administrationId || '',
      },
      {
        enabled: !!patient?.id && !!administrationId,
      },
    ),
  );

  const tValue = tValueData?.T ?? 'N/A';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const therapist = await queryClient.fetchQuery(
        api.therapist.findUnique.queryOptions(),
      );
      const therapistName = therapist?.user?.firstName || '';
      const therapistlastName = therapist?.user?.lastName || '';

      return {
        therapistName,
        therapistlastName,
        modality: 'autonoma_presenza',
        date: new Date(),
        time: new Date().toTimeString().slice(0, 5),
      };
    },
  });

  const onSubmit = (data: FormValues) => {
    const queryParams = new URLSearchParams();

    queryParams.set('therapistName', data.therapistName);
    queryParams.set('therapistlastName', data.therapistlastName);
    queryParams.set('modality', data.modality);

    const dateString = data.date.toISOString().split('T')[0];

    const createdAt = new Date(`${dateString}T${data.time}:00`);
    queryParams.set('createdAt', createdAt.toISOString());

    onFormComplete(queryParams.toString());
  };

  const onError: SubmitErrorHandler<FormValues> = () => {
    toast.warning(
      'Compila tutti i campi obbligatori per poter assegnare la somministrazione.',
    );
  };

  return (
    <div className="p-4 pt-0">
      <h1 className="text-2xl font-bold">Nuova Compilazione</h1>

      <div className="flex justify-end gap-3 pb-3">
        <Button variant="outline" size="sm">
          Assegna
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={form.handleSubmit(onSubmit, onError)}
        >
          Inizia
        </Button>
      </div>

      <Form {...form}>
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-4 bg-white p-4">
            <h2 className="font-semibold">Dettagli compilazione</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 leading-none">
                <p className="text-xs leading-6">Tempo di compilazione</p>
                <p className="font-medium">T{tValue}</p>
              </div>
              <FormField
                control={form.control}
                name="modality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Modalità{' '}
                      <span className="text-primary">Obbligatorio</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="autonoma_presenza">
                            autonoma_presenza
                          </SelectItem>
                          <SelectItem value="intervista">intervista</SelectItem>
                          <SelectItem value="accompagnatore">
                            accompagnatore
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data <span className="text-primary">Obbligatorio</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="input"
                            className={cn(
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: it,
                              })
                            ) : (
                              <span>Seleziona la data</span>
                            )}
                            <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                defaultValue="00:00"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ora <span className="text-primary">Obbligatorio</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-white p-4">
            <h2 className="text-base font-semibold">Clinico</h2>

            <FormField
              control={form.control}
              name="therapistName"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className="text-primary">Obbligatorio</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Clinico" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="therapistlastName"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cognome <span className="text-primary">Obbligatorio</span>
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="Cognome Clinico" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
