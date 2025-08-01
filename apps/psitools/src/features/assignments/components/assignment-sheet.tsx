'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Assignment } from '@prisma/client';
import { $Enums } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar1Icon, Check, ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import type {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ADMINISTRATION_TYPES } from '@/features/questionnaires/settings';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

const available = ADMINISTRATION_TYPES.map((type) => {
  return { value: type.id, label: type.name };
});

const Weekday = z.enum(['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']);
type TWeekday = z.infer<typeof Weekday>;

const noneRecurrence = z.object({
  name: z.string().min(1, { message: "L'assegnazione è obbligatoria" }),
  type: z.nativeEnum($Enums.AssignmentType),
  date: z.date(),
  recurrence: z.literal($Enums.AssignmentRecurrence.none),
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday),
    dayOfMonth: z.array(z.number().int().min(1).max(31)),
  }),
});

const dailyRecurrence = z.object({
  name: z.string().min(1, { message: "L'assegnazione è obbligatoria" }),
  type: z.nativeEnum($Enums.AssignmentType),
  date: z.date(),
  recurrence: z.literal($Enums.AssignmentRecurrence.daily),
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday),
    dayOfMonth: z.array(z.number().int().min(1).max(31)),
  }),
});

const weeklyRecurrence = z.object({
  name: z.string().min(1, { message: "L'assegnazione è obbligatoria" }),
  type: z.nativeEnum($Enums.AssignmentType),
  date: z.date(),
  recurrence: z.literal($Enums.AssignmentRecurrence.weekly),
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday).min(1, {
      message: 'Deve essere presente almeno un giorno della settimana',
    }),
  }),
});
type WeeklyRecurrence = z.infer<typeof weeklyRecurrence>;

const monthlyRecurrence = z.object({
  name: z.string().min(1, { message: "L'assegnazione è obbligatoria" }),
  type: z.nativeEnum($Enums.AssignmentType),
  date: z.date(),
  recurrence: z.literal($Enums.AssignmentRecurrence.monthly),
  recurrenceConfig: z.object({
    dayOfMonth: z
      .array(z.number().int().min(1).max(31))
      .min(1, { message: 'Deve essere presente almeno un giorno del mese' }),
  }),
});
type MonthlyRecurrence = z.infer<typeof monthlyRecurrence>;

export const assignmentSchema = z.discriminatedUnion('recurrence', [
  noneRecurrence,
  dailyRecurrence,
  weeklyRecurrence,
  monthlyRecurrence,
]);

const assigmentTypeEnum = {
  [$Enums.AssignmentType.diary]: 'Diario',
  [$Enums.AssignmentType.administration]: 'Somministrazione',
  [$Enums.AssignmentType.drugs]: 'Farmaci',
};

const getSheetTitle = (assignment?: Partial<Assignment>) => {
  if (!assignment) return 'Nuova Assegnazione';
  if (assignment.type === $Enums.AssignmentType.administration) {
    const available = ADMINISTRATION_TYPES.find(
      (item) => item.id === assignment.name,
    );

    return `${assigmentTypeEnum[assignment.type]} ${available?.name || assignment.name}`;
  }
  if (assignment.type === $Enums.AssignmentType.diary) {
    return `${assigmentTypeEnum[assignment.type]} ${assignment.name}`;
  }

  return 'Assegnazione nuovo farmaco';
};

type AssignmentForm = z.infer<typeof assignmentSchema>;

const RecurrenceConfig = ({
  recurrence,
  ...form
}: {
  recurrence: $Enums.AssignmentRecurrence;
} & UseFormReturn<AssignmentForm>) => {
  if (recurrence === $Enums.AssignmentRecurrence.weekly) {
    const items = [
      { id: 'Lun', label: 'Lun' },
      { id: 'Mar', label: 'Mar' },
      { id: 'Mer', label: 'Mer' },
      { id: 'Gio', label: 'Gio' },
      { id: 'Ven', label: 'Ven' },
      { id: 'Sab', label: 'Sab' },
      { id: 'Dom', label: 'Dom' },
    ];

    const sortWeekdayFn = (a: string, b: string) => {
      const order = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
      return order.indexOf(a) - order.indexOf(b);
    };

    return (
      <FormField
        control={form.control}
        name="recurrenceConfig.weekdays"
        render={() => (
          <FormItem>
            <FormLabel>Quando</FormLabel>
            <div className="grid grid-cols-7 gap-1">
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="recurrenceConfig.weekdays"
                  render={({ field }) => {
                    const value = field.value || [];
                    return (
                      <FormItem key={item.id} className="space-y-0">
                        <FormControl>
                          <Checkbox
                            className="sr-only"
                            checked={value.includes(item.id as TWeekday)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange(
                                    [...field.value, item.id].sort(
                                      sortWeekdayFn,
                                    ),
                                  )
                                : field.onChange(
                                    value
                                      .filter((value) => value !== item.id)
                                      .sort(sortWeekdayFn),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            'block cursor-pointer rounded-sm border border-primary text-center text-sm transition-colors',
                            value.includes(item.id as TWeekday)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-transparent text-primary',
                          )}
                        >
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (recurrence === $Enums.AssignmentRecurrence.monthly) {
    const transform = {
      input: (value: number[] | null) => {
        if (!value) return [];
        return value.map((v) => v.toString());
      },
      output: (value: string[]) => {
        return value.map((v) => parseInt(v, 10));
      },
    };
    return (
      <FormField
        control={form.control}
        name="recurrenceConfig.dayOfMonth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giorni del mese</FormLabel>
            <FormControl>
              <MultiSelect
                options={Array.from({ length: 31 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: (i + 1).toString(),
                }))}
                value={transform.input(field.value)}
                onValueChange={(value) =>
                  field.onChange(transform.output(value))
                }
                placeholder="Seleziona i giorni del mese"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return null;
};

export const AssignmentSheet = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    assignment?: Partial<Assignment>;
    label?: string;
    sheetProps?: React.ComponentPropsWithoutRef<typeof Sheet>;
  }
>(({ assignment, label, sheetProps, ...props }, ref) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { userId } = useParams<{ userId: string }>();

  const [open, setOpen] = React.useState(false);

  const getDefaultValues = () => {
    if (assignment?.id) {
      switch (assignment.recurrence) {
        case $Enums.AssignmentRecurrence.none:
        case $Enums.AssignmentRecurrence.daily:
          return {
            recurrence: assignment.recurrence,
            name: assignment.name,
            type: assignment.type,
            date: assignment.date,
            recurrenceConfig: { weekdays: [], dayOfMonth: [] },
          };
        case $Enums.AssignmentRecurrence.weekly:
          return {
            recurrence: assignment.recurrence,
            name: assignment.name,
            type: assignment.type,
            date: assignment.date,
            recurrenceConfig: {
              weekdays: (
                assignment.recurrenceConfig as WeeklyRecurrence['recurrenceConfig']
              ).weekdays,
            },
          };
        case $Enums.AssignmentRecurrence.monthly:
          return {
            recurrence: assignment.recurrence,
            name: assignment.name,
            type: assignment.type,
            date: assignment.date,
            recurrenceConfig: {
              dayOfMonth: (
                assignment.recurrenceConfig as MonthlyRecurrence['recurrenceConfig']
              ).dayOfMonth,
            },
          };
        default:
          return {
            name: '',
            type: $Enums.AssignmentType.diary,
            date: new Date(),
            recurrence: $Enums.AssignmentRecurrence.none,
            recurrenceConfig: { weekdays: [], dayOfMonth: [] },
          };
      }
    }
    if (assignment?.name && assignment?.type) {
      return {
        name: assignment.name,
        type: assignment.type,
        date: new Date(),
        recurrence: $Enums.AssignmentRecurrence.none,
        recurrenceConfig: { weekdays: [], dayOfMonth: [] },
      };
    }
    if (assignment?.type) {
      return {
        name: '',
        type: assignment.type,
        date: new Date(),
        recurrence: $Enums.AssignmentRecurrence.none,
        recurrenceConfig: { weekdays: [], dayOfMonth: [] },
      };
    }

    return {
      name: '',
      type: $Enums.AssignmentType.diary,
      date: new Date(),
      recurrence: $Enums.AssignmentRecurrence.none,
      recurrenceConfig: { weekdays: [], dayOfMonth: [] },
    };
  };

  const form = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: getDefaultValues(),
  });

  const closeSheet = () => {
    if (sheetProps?.onOpenChange) {
      return sheetProps.onOpenChange(false);
    }
    return setOpen(false);
  };

  const { mutateAsync: create } = useMutation(
    api.assignments.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.assignments.get.queryFilter());
        toast.success('Assegnazione creata con successo');
        closeSheet();
        form.reset();
      },
      onError: (error) => {
        toast.error(
          `Errore durante la creazione dell'assegnazione: ${JSON.stringify(error)}`,
        );
      },
    }),
  );

  const { mutateAsync: update } = useMutation(
    api.assignments.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.assignments.get.queryFilter());
        toast.success('Assegnazione creata con successo');
        closeSheet();
        form.reset();
      },
      onError: (error) => {
        toast.error(
          `Errore durante la creazione dell'assegnazione: ${JSON.stringify(error)}`,
        );
      },
    }),
  );

  const type = useWatch({ name: 'type', control: form.control });
  const recurrence = useWatch({ name: 'recurrence', control: form.control });

  const getOptions = (type: $Enums.AssignmentType) => {
    switch (type) {
      case $Enums.AssignmentType.diary:
        return [
          { value: 'alimentare', label: 'Diario Alimentare' },
          {
            value: 'cognitivo-comportamentale',
            label: 'Diario Cognitivo Comportamentale',
          },
          {
            value: 'sonno-mattina',
            label: 'Diario del sonno (mattina)',
          },
          {
            value: 'sonno-sera',
            label: 'Diario del sonno (sera)',
          },
        ];
      case $Enums.AssignmentType.administration:
        return available;
      default:
        return [];
    }
  };

  const onSubmit: SubmitHandler<AssignmentForm> = async (data) => {
    let mutateObj: AssignmentForm;

    switch (data.recurrence) {
      case $Enums.AssignmentRecurrence.none:
      case $Enums.AssignmentRecurrence.daily:
        mutateObj = {
          recurrence: data.recurrence,
          name: data.name,
          type: data.type,
          date: data.date,
          recurrenceConfig: {
            weekdays: data.recurrenceConfig.weekdays ?? [],
            dayOfMonth: data.recurrenceConfig.dayOfMonth ?? [],
          },
        };
        break;
      case $Enums.AssignmentRecurrence.weekly:
        mutateObj = {
          recurrence: data.recurrence,
          name: data.name,
          type: data.type,
          date: data.date,
          recurrenceConfig: { weekdays: data.recurrenceConfig.weekdays ?? [] },
        };
        break;
      case $Enums.AssignmentRecurrence.monthly:
        mutateObj = {
          recurrence: data.recurrence,
          name: data.name,
          type: data.type,
          date: data.date,
          recurrenceConfig: {
            dayOfMonth: data.recurrenceConfig.dayOfMonth ?? [],
          },
        };
        break;
      default:
        throw new Error('Invalid recurrence type');
    }

    if (assignment?.id) {
      await update({
        data: { ...mutateObj, patientId: assignment?.patientId ?? userId },
        id: assignment.id,
      });
      return;
    } else {
      await create({
        ...mutateObj,
        patientId: assignment?.patientId ?? userId,
      });
    }
  };

  const onError: SubmitErrorHandler<AssignmentForm> = (error) => {
    console.log('Form error:', error);
  };

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen} {...sheetProps}>
      <SheetTrigger asChild>
        <Button ref={ref} {...props}>
          {label ? label : 'Nuova'}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="sticky top-0 bg-white p-6">
          <SheetTitle>{getSheetTitle(assignment)}</SheetTitle>
          <SheetDescription className="sr-only">
            Pannello di assegnazione per le attività. Puoi assegnare un'attività
            a un paziente specifico. Seleziona il tipo di attività e compila i
            dettagli richiesti. Una volta completato, fai clic su "Assegna" per
            salvare l'assegnazione.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="space-y-3 overflow-y-auto px-6">
            {assignment ? null : (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(type) => {
                          form.setValue('name', '');
                          return field.onChange(type);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values($Enums.AssignmentType).map((type) => {
                            let label = '';
                            switch (type) {
                              case $Enums.AssignmentType.diary:
                                label = 'Diario';
                                break;
                              case $Enums.AssignmentType.administration:
                                label = 'Somministrazione';
                                break;
                              case $Enums.AssignmentType.drugs:
                                label = 'Farmaci';
                                break;
                            }

                            return (
                              <SelectItem key={type} value={type}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {assignment && type !== 'drugs' ? null : (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  const options = getOptions(type);
                  return (
                    <FormItem>
                      <FormLabel>Assegnazione</FormLabel>
                      <FormControl>
                        {type === 'drugs' ? (
                          <Input
                            type="text"
                            placeholder="Nome del farmaco"
                            {...field}
                            className={cn(
                              'w-full border-input bg-transparent',
                              !field.value && 'text-muted-foreground',
                            )}
                          />
                        ) : (
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'w-full justify-between border-input bg-transparent px-3 text-foreground hover:bg-transparent',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value.length > 0
                                    ? options.find(
                                        (option) =>
                                          option.value === field.value,
                                      )?.label
                                    : "Seleziona un'assegnazione"}
                                  <span className="sr-only">
                                    Seleziona un'assegnazione
                                  </span>
                                  <ChevronDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Cerca assegnazione..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    Nessuna assegnazione trovata.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {options.map((option) => (
                                      <CommandItem
                                        value={option.label}
                                        key={option.value}
                                        onSelect={() => {
                                          form.setValue('name', option.value);
                                        }}
                                      >
                                        {option.label}
                                        <Check
                                          className={cn(
                                            'ml-auto h-4 w-4 text-primary',
                                            option.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                const hours = Array.from({ length: 24 }, (_, i) => i);
                const minutes = Array.from({ length: 60 }, (_, i) => i);

                return (
                  <FormItem className="col-span-2 flex flex-col">
                    <FormLabel>Data di assegnazione</FormLabel>
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
                              format(field.value, 'PPP', { locale: it })
                            ) : (
                              <span>Seleziona la data di nascita</span>
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
                          onSelect={(date) => {
                            const hours = field.value.getHours();
                            const minutes = field.value.getMinutes();
                            date?.setHours(hours, minutes);
                            return field.onChange(date);
                          }}
                          initialFocus
                        />
                        <div className="grid justify-center space-y-2 p-3 text-sm">
                          <p className="text-sm font-semibold">
                            Seleziona l'orario
                          </p>
                          <div className="flex items-center space-x-1">
                            <Select
                              onValueChange={(value) => {
                                field.value.setHours(+value);
                                field.onChange(field.value);
                              }}
                              defaultValue={field.value.getHours().toString()}
                            >
                              <SelectTrigger
                                indicator={false}
                                className="w-12 justify-center text-center"
                                onPointerDown={(e) => e.stopPropagation()}
                              >
                                <SelectValue placeholder="Ora" />
                              </SelectTrigger>
                              <SelectContent
                                className="max-h-60 min-w-(--radix-popper-anchor-width)"
                                onCloseAutoFocus={(e) => e.preventDefault()}
                              >
                                {hours.map((hour) => (
                                  <SelectItem
                                    indicator={false}
                                    key={hour}
                                    value={hour.toString()}
                                    // disabled if is today and hour is less than current hour
                                    disabled={
                                      field.value.getDate() ===
                                        new Date().getDate() &&
                                      field.value.getMonth() ===
                                        new Date().getMonth() &&
                                      field.value.getFullYear() ===
                                        new Date().getFullYear() &&
                                      hour < new Date().getHours()
                                    }
                                    className={cn(
                                      'items-center justify-center px-2',
                                      field.value.getHours() === hour
                                        ? 'bg-muted'
                                        : '',
                                    )}
                                  >
                                    {hour.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              onValueChange={(value) => {
                                field.value.setMinutes(+value);
                                field.onChange(field.value);
                              }}
                              defaultValue={field.value.getMinutes().toString()}
                            >
                              <SelectTrigger
                                indicator={false}
                                className="w-12 justify-center text-center"
                                onPointerDown={(e) => e.stopPropagation()}
                              >
                                <SelectValue placeholder="Minuti" />
                              </SelectTrigger>
                              <SelectContent
                                className="max-h-60 min-w-(--radix-popper-anchor-width)"
                                onCloseAutoFocus={(e) => e.preventDefault()}
                              >
                                {minutes.map((minute) => (
                                  <SelectItem
                                    indicator={false}
                                    key={minute}
                                    value={minute.toString()}
                                    // disabled if is today and minutes is less than current minutes
                                    disabled={
                                      field.value.getDate() ===
                                        new Date().getDate() &&
                                      field.value.getMonth() ===
                                        new Date().getMonth() &&
                                      field.value.getFullYear() ===
                                        new Date().getFullYear() &&
                                      (field.value.getHours() >
                                        new Date().getHours() ||
                                        (field.value.getHours() ===
                                          new Date().getHours() &&
                                          minute < new Date().getMinutes()))
                                    }
                                    className={cn(
                                      'items-center justify-center px-2',
                                      field.value.getMinutes() === minute
                                        ? 'bg-muted'
                                        : '',
                                    )}
                                  >
                                    {minute.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ripetizione</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una frequenza" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values($Enums.AssignmentRecurrence).map(
                          (frequency) => {
                            let label = '';
                            switch (frequency) {
                              case $Enums.AssignmentRecurrence.daily:
                                label = 'Giornaliera';
                                break;
                              case $Enums.AssignmentRecurrence.weekly:
                                label = 'Settimanale';
                                break;
                              case $Enums.AssignmentRecurrence.monthly:
                                label = 'Mensile';
                                break;
                              default:
                                label = 'Nessuna';
                            }
                            return (
                              <SelectItem key={frequency} value={frequency}>
                                {label}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RecurrenceConfig recurrence={recurrence} {...form} />
            <AssignmentDescription form={form} />
          </form>
        </Form>
        <SheetFooter className="sticky bottom-0 z-10 mt-auto bg-white p-6">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit, onError)}
          >
            {assignment?.id ? 'Modifica assegnazione' : 'Assegna'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

const AssignmentDescription = ({
  form,
}: {
  form: UseFormReturn<AssignmentForm>;
}) => {
  const { name, type, recurrence, date, recurrenceConfig } = form.watch();
  const { patient, isLoading } = usePatient();
  if (isLoading || !patient || !name) return null;

  const getAssignmentName = () => {
    if (type === $Enums.AssignmentType.administration) {
      const available = ADMINISTRATION_TYPES.find((item) => item.id === name);

      return `${assigmentTypeEnum[type]} ${available?.name || name}`;
    }
    if (type === $Enums.AssignmentType.diary) {
      return `${assigmentTypeEnum[type]} ${name}`;
    }
    return name;
  };
  const assignmentName = getAssignmentName();

  const getRecurrenceDescription = () => {
    switch (recurrence) {
      case $Enums.AssignmentRecurrence.none:
        return '';
      case $Enums.AssignmentRecurrence.daily:
        return 'ogni giorno';
      case $Enums.AssignmentRecurrence.weekly:
        return `ogni ${recurrenceConfig.weekdays
          .map((day) => {
            switch (day) {
              case 'Lun':
                return 'lunedì';
              case 'Mar':
                return 'martedì';
              case 'Mer':
                return 'mercoledì';
              case 'Gio':
                return 'giovedì';
              case 'Ven':
                return 'venerdì';
              case 'Sab':
                return 'sabato';
              case 'Dom':
                return 'domenica';
            }
          })
          .join(', ')}`;
      case $Enums.AssignmentRecurrence.monthly:
        return `ogni mese il giorno ${recurrenceConfig.dayOfMonth.join(', ')}`;
      default:
        return '';
    }
  };

  const recurrenceDescription = getRecurrenceDescription();

  const formattedDate = format(date, 'PPP', { locale: it });
  const formattedTime = format(date, 'p', { locale: it });

  const when =
    recurrence === $Enums.AssignmentRecurrence.none ? `il` : `a partire dal`;
  const getAssignmentInstructions = () => {
    if (type !== $Enums.AssignmentType.drugs) {
      return (
        <p>
          <strong>{patient.user?.name}</strong> riceverà{' '}
          <strong>{assignmentName}</strong> da compilare{' '}
          <strong>{recurrenceDescription}</strong> {when}{' '}
          <strong>{formattedDate}</strong> alle <strong>{formattedTime}</strong>
          .
        </p>
      );
    }
    return (
      <p>
        <strong>{patient.user?.name}</strong> deve assumere{' '}
        <strong>{assignmentName}</strong>{' '}
        <strong>{recurrenceDescription}</strong> {when}{' '}
        <strong>{formattedDate}</strong> alle <strong>{formattedTime}</strong>.
      </p>
    );
  };

  const assignmentInstructions = getAssignmentInstructions();

  return <div className="text-sm">{assignmentInstructions}</div>;
};
