import type { Event } from '@arianne/db';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronDown, Copy, Trash2, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { generateMeetingLink } from '@/features/agenda/utils/generate-meeting-link';
import { useTRPC } from '@/trpc/react';

interface EventViewProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onDelete: (event: Event) => void;
  onSave: (data: Event) => void;
  isEditingModeTrigger: boolean;
}

type RepeatType =
  | 'never'
  | 'everyDay'
  | 'everyWeek'
  | 'everyTwoWeeks'
  | 'everyThreeWeeks'
  | 'everyMonth';
type NotificationType = 'no' | 'sameDay' | 'oneDayBefore' | 'twoDaysBefore';

const EventDetails: React.FC<EventViewProps> = ({
  isOpen,
  onClose,
  event,
  onDelete,

  isEditingModeTrigger,
}) => {
  const [eventName, setEventName] = useState(event.name);
  const [patient, setPatient] = useState(event.patientId);
  const [eventDate, setEventDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [meetingLink, setMeetingLink] = useState(event.meetingLink);
  const [location, setLocation] = useState(event.location);
  const [labelColor, setLabelColor] = useState(event.labelColor);
  const [isAllDay, setIsAllDay] = useState(event.isAllDay);
  const [currentStartTime, setCurrentStartTime] = useState(startTime);

  const [eventDescription, setEventDescription] = useState('');

  const [eventEndDate, setEventEndDate] = useState(new Date());

  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);

  const [selected, setSelected] = useState<string[]>([]);
  const [_selectedString, setSelectedString] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [repeat, setRepeat] = useState<RepeatType>('never');

  const [notificationLabel, setNotificationLabel] =
    useState<NotificationType>('no');
  const defaultColors = [
    '#e0ede3',
    '#f2d9de',
    '#d9ebf2',
    '#e2daf2',
    '#fce2d4',
    '#fdf4d0',
  ];

  const api = useTRPC();
  const queryClient = useQueryClient();

  const therapist = useQuery(api.therapist.getAllPatients.queryOptions());
  useEffect(() => {
    if (event) {
      setEventName(event.name || '');
      setPatient(event.patientId || '');
      setMeetingLink(event.meetingLink || '');
      setLocation(event.location || '');
      setLabelColor(event.labelColor || defaultColors[0]);
      setEventDate(new Date(event.date));
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setIsAllDay(event.isAllDay || false);
      setRepeat(event.recurring ? (event.recurring as RepeatType) : 'never');
      setNotificationLabel(
        event.notification ? (event.notification as NotificationType) : 'no',
      );
      setEventDescription(event.description || '');
      setEventEndDate(event.endDate || new Date());
      setAdditionalParticipants(event.otherPartecipants || []);
    }
    if (event.patientId) {
      setSelected([event.patientId]);
    } else {
      setSelected([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    if (event?.patientId && therapist.data) {
      const selectedPatient = therapist.data.find(
        (p) => p.id === event.patientId,
      );
      if (selectedPatient) {
        setSelected([selectedPatient.id]);
        setSelectedString(selectedPatient.user?.name ?? '');
      }
    }
  }, [event?.patientId, therapist.data]);

  const options = therapist.data?.map((patient) => {
    return { label: patient.user?.name ?? '', value: patient.id ?? '' };
  });
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const min of ['00', '30']) {
        times.push(`${hour.toString().padStart(2, '0')}:${min}`);
      }
    }
    return times;
  };
  const timeOptions = generateTimeSlots();

  const updateEvent = useMutation(
    api.event.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const createEvent = useMutation(
    api.event.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const handleSave = () => {
    if (!eventName.trim()) {
      toast.error('Nome evento è obbligatorio');
      return;
    }

    if (eventEndDate < eventDate) {
      toast.error(
        "La data di fine non può essere precedente alla data d'inizio",
      );
      return;
    }

    if (
      !isAllDay &&
      eventEndDate.toDateString() === eventDate.toDateString() &&
      endTime <= startTime
    ) {
      toast.error(
        "L'orario di fine deve essere successivo all'orario di inizio",
      );
      return;
    }

    const eventData = {
      name: eventName,
      patientId: patient || undefined,
      date: eventDate,
      meetingLink: meetingLink,
      location: location,
      labelColor: labelColor,
      startTime: startTime,
      endTime: endTime,
      isAllDay: isAllDay,
      otherPartecipants: [...additionalParticipants],
      recurring: repeat,
      notification: notificationLabel,
      description: eventDescription,
      endDate: eventEndDate,
    };

    if (event.id) {
      updateEvent.mutate(
        {
          id: event.id,
          ...eventData,
        },
        {
          onSuccess: () => {
            toast.success('Evento salvato con successo!');
            setIsEditingMode(false);
            onClose();
          },
          onError: (error) => {
            toast.error(`Errore nella modifica dell'evento: ${error.message}`);
          },
        },
      );
    } else {
      createEvent.mutate(eventData, {
        onSuccess: () => {
          toast.success('Evento creato con successo!');
          onClose();
        },
        onError: (error) => {
          toast.error(`Errore nella creazione dell'evento: ${error.message}`);
        },
      });
    }
  };

  const handleAddParticipant = () => {
    setAdditionalParticipants([...additionalParticipants, '']);
  };

  const handleRemoveParticipant = (index: number) => {
    const updated = [...additionalParticipants];
    updated.splice(index, 1);
    setAdditionalParticipants(updated);
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...additionalParticipants];
    updated[index] = value;
    setAdditionalParticipants(updated);
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiato negli appunti!');
    } catch (err) {
      console.error('Errore nella copia:', err);
    }
  };

  useEffect(() => {
    setIsEditingMode(isEditingModeTrigger);
  }, [isEditingModeTrigger]);

  const patientName =
    therapist.data?.find((p) => p.id === event?.patientId)?.user?.name ??
    event?.patientId;

  const [isEditingMode, setIsEditingMode] = useState(false);

  const recurringTranslations: Record<
    NonNullable<Event['recurring']>,
    string
  > = {
    never: 'Mai',
    everyDay: 'Ogni giorno',
    everyWeek: 'Ogni settimana',
    everyTwoWeeks: 'Ogni due settimane',
    everyThreeWeeks: 'Ogni tre settimane',
    everyMonth: 'Ogni mese',
  };

  const notificationTranslations: Record<
    NonNullable<Event['notification']>,
    string
  > = {
    no: 'Nessun promemoria',
    sameDay: 'Lo stesso giorno',
    oneDayBefore: '1 giorno prima',
    twoDaysBefore: '2 giorni prima',
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditingMode(false);
          onClose();
        }
      }}
      modal={false}
    >
      <SheetContent className="overflow-y-auto py-0">
        {isEditingMode ? (
          <>
            <div className="sticky top-0 z-10 flex items-end justify-between bg-white py-4">
              <SheetTitle>Modifica Evento</SheetTitle>
            </div>

            <div className="mb-4 flex gap-2">
              <div className="w-full">
                <label className="block text-[14px]">Nome Evento</label>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full rounded-md border border-[#ccdbef] p-2 placeholder:text-[#94a3b8] focus:border-forest-green-700 focus:outline-none md:text-base"
                  placeholder="Nome evento"
                />
              </div>
              <div>
                <label className="block text-[14px]">Colore</label>
                <Popover
                  open={showColorPicker}
                  onOpenChange={setShowColorPicker}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="flex h-9 w-[74px] items-center justify-between rounded-md border border-gray-200 px-2 py-1"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <div
                        className="h-6 w-6 rounded"
                        style={{
                          backgroundColor: labelColor || defaultColors[0],
                        }}
                      />
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-600" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {defaultColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setLabelColor(color);
                            setShowColorPicker(false);
                          }}
                          className={`h-6 w-6 rounded-sm border ${
                            labelColor === color
                              ? 'ring-1 ring-forest-green-700'
                              : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <label className="text-[14px]">Paziente</label>
            {options && (
              <MultiSelect
                id="state"
                searchable={false}
                defaultValue={selected}
                value={selected}
                onValueChange={(value) => {
                  if (value.length === 0) {
                    return setSelected([]);
                  }
                  setSelected(value);
                  const selectedPatient = options.find(
                    (option) => option.value === value[0],
                  );
                  if (selectedPatient) {
                    setPatient(selectedPatient.value);
                    setSelectedString(selectedPatient.label);
                  }
                }}
                options={options}
                placeholder="Seleziona il paziente"
              />
            )}
            <label className="text-[14px]">Altri partecipanti</label>
            <div className="mb-4 flex flex-col gap-2">
              {additionalParticipants.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      handleParticipantChange(index, e.target.value)
                    }
                    placeholder="Email partecipante"
                    className="w-full border border-[#ccdbef] text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveParticipant(index)}
                    className="border-red-500 text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                onClick={handleAddParticipant}
                className="justify-start py-0 pl-0 text-base text-primary hover:bg-white hover:text-primary/80"
              >
                + Aggiungi partecipante
              </Button>
            </div>

            <div className="mb-2 grid grid-cols-2 grid-rows-1 gap-2">
              <div>
                <label className="block text-[14px]">Inizio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full rounded-md border border-[#ccdbef] bg-white p-2 text-left text-base">
                      {format(eventDate, 'dd/MM/yyyy', { locale: it })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={(date) => date && setEventDate(date)}
                      className="rounded-md border shadow"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-[14px]">Fine</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full rounded-md border border-[#ccdbef] bg-white p-2 text-left text-base">
                      {format(eventEndDate, 'dd/MM/yyyy', { locale: it })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={eventEndDate}
                      onSelect={(endDate) =>
                        endDate && setEventEndDate(endDate)
                      }
                      className="rounded-md border shadow"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mb-2">
              {!isAllDay && (
                <div className="col-start-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[14px]">Orario Inizio</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full rounded-md border border-[#ccdbef] bg-white p-2 text-left text-base">
                          {currentStartTime}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0">
                        <ScrollArea className="h-40">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              onClick={() => {
                                setCurrentStartTime(time);
                                setStartTime(time);
                              }}
                              className={`block w-full p-2 text-left text-base ${
                                startTime === time
                                  ? 'bg-forest-green-700 text-white'
                                  : 'w-12 hover:bg-gray-200'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-[14px]">Orario Fine</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full rounded-md border border-[#ccdbef] bg-white p-2 text-left text-base">
                          {endTime}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0">
                        <ScrollArea className="h-40 w-full">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              onClick={() => setEndTime(time)}
                              className={`block w-full p-2 text-left text-base ${
                                endTime === time
                                  ? 'bg-forest-green-700 text-white'
                                  : 'hover:bg-gray-200'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4 flex items-center">
              <Checkbox
                checked={isAllDay}
                onCheckedChange={(checked) => setIsAllDay(!!checked)}
              />
              <label className="ml-2 text-[14px]">Tutto il giorno</label>
            </div>

            <div className="mb-4">
              <label className="block text-[14px]">Ripetizione</label>

              <Select
                value={repeat}
                onValueChange={(value) =>
                  setRepeat(
                    value as
                      | 'never'
                      | 'everyDay'
                      | 'everyWeek'
                      | 'everyTwoWeeks'
                      | 'everyThreeWeeks'
                      | 'everyMonth',
                  )
                }
              >
                <SelectTrigger className="text-md border border-[#ccdbef] bg-white text-base">
                  <SelectValue placeholder="Frequenza" />
                </SelectTrigger>
                <SelectContent className="text-base">
                  <SelectItem value="never">Non si ripete</SelectItem>
                  <SelectItem value="everyDay">Ogni giorno</SelectItem>
                  <SelectItem value="everyWeek">Ogni settimana</SelectItem>
                  <SelectItem value="everyTwoWeeks">
                    Ogni due settimane
                  </SelectItem>
                  <SelectItem value="everyThreeWeeks">
                    Ogni tre settimane
                  </SelectItem>
                  <SelectItem value="everyMonth">Ogni mese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="col-span-1 block text-[14px]">
                Aggiungi link Meet
              </label>
              <div className="relative grid grid-cols-[1fr_auto] gap-2">
                <div className="group relative">
                  <Input
                    type="text"
                    value={meetingLink ?? ''}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="col-span-1 w-full rounded-md border border-[#ccdbef] p-2 text-base placeholder:text-[#94a3b8] focus:border-forest-green-700 focus:outline-none md:text-base"
                    placeholder="Link Meet"
                  />

                  {meetingLink && (
                    <Button
                      size="icon"
                      onClick={() => handleCopyToClipboard(meetingLink)}
                      className="absolute right-1 top-1 hidden h-7 w-7 bg-primary-200 text-primary hover:bg-primary-300 hover:text-gray-700 group-hover:flex"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const { data, error } = await generateMeetingLink();
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    setMeetingLink(data);
                  }}
                  className="col-span-1 text-base"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[14px]">Indirizzo</label>
              <Input
                type="text"
                value={location ?? ''}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-1 w-full rounded-md border border-[#ccdbef] p-2 text-base placeholder:text-[#94a3b8] focus:border-forest-green-700 focus:outline-none md:text-base"
                placeholder="Indirizzo"
              />
            </div>

            <label className="block text-[14px]">Promemoria</label>

            <Select
              value={notificationLabel}
              onValueChange={(value) =>
                setNotificationLabel(
                  value as 'no' | 'sameDay' | 'oneDayBefore' | 'twoDaysBefore',
                )
              }
            >
              <SelectTrigger className="text-md mb-4 border border-[#ccdbef] bg-white text-base">
                <SelectValue placeholder="Notifiche" />
              </SelectTrigger>
              <SelectContent className="text-base">
                <SelectItem value="no">Non inviare</SelectItem>
                <SelectItem value="sameDay">Quando inizia l'evento</SelectItem>
                <SelectItem value="oneDayBefore">Un giorno prima</SelectItem>
                <SelectItem value="twoDaysBefore">Due giorni prima</SelectItem>
              </SelectContent>
            </Select>
            <div className="mb-4">
              <label className="block text-[14px]">Note</label>
              <Textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Note evento"
                className="max-h-24 overflow-y-auto"
              />
            </div>
            <div className="sticky bottom-0 w-full bg-white py-4">
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={handleSave} className="text-base">
                  Salva
                </Button>

                <Button
                  variant="outline"
                  className="border-[#e55934] text-base text-[#e55934] hover:border-none hover:bg-[#ea7a5d] hover:text-white"
                  onClick={() => setIsEditingMode(false)}
                >
                  Annulla
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sticky top-0 z-10 flex items-end justify-between bg-white py-4">
              <SheetTitle>{event.name}</SheetTitle>
            </div>
            <div className="flex gap-2">
              {event.name && (
                <div className="w-full">
                  <label className="block py-2 text-[14px] text-[#64748B]">
                    Nome Evento
                  </label>
                  <p>{event.name}</p>
                </div>
              )}

              {event.labelColor && (
                <div className="mb-4">
                  <label className="block py-2 text-[14px] text-[#64748B]">
                    Colore
                  </label>
                  <div className="flex h-9 w-[74px] items-center justify-between rounded-md px-2 py-1">
                    <div
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: event.labelColor }}
                    />
                  </div>
                </div>
              )}
            </div>

            {event.patientId && (
              <div className="mb-4">
                <label className="py-2 text-[14px] text-[#64748B]">
                  Paziente
                </label>
                <p>{patientName}</p>
              </div>
            )}

            {event.otherPartecipants && event.otherPartecipants.length > 0 && (
              <div className="mb-4">
                <label className="py-2 text-[14px] text-[#64748B]">
                  Altri partecipanti
                </label>
                <div className="mb-4 flex flex-col gap-2">
                  {event.otherPartecipants.map((email, index) => (
                    <p key={index}>{email}</p>
                  ))}
                </div>
              </div>
            )}
            {event.date && (
              <div className="mb-2 gap-2">
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Inizio
                </label>
                <div className="flex items-center gap-1">
                  <p>{format(event.date, 'dd MMMM yyyy', { locale: it })}</p>
                  {event.endDate && !isSameDay(event.date, event.endDate) && (
                    <span>
                      - {format(event.endDate, 'dd MMMM yyyy', { locale: it })}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="col-start-2 mb-2">
              <label className="block py-2 text-[14px] text-[#64748B]">
                Orario
              </label>

              <p>
                {event.isAllDay
                  ? 'Tutto il giorno'
                  : event.startTime
                    ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`
                    : ''}
              </p>
            </div>

            {event.recurring && (
              <div className="mb-4">
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Ripetizione
                </label>
                <p>{recurringTranslations[event.recurring]}</p>
              </div>
            )}

            {event.meetingLink && (
              <div className="mb-4">
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Link Meet
                </label>
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {event.meetingLink}
                </a>
              </div>
            )}

            {event.location && (
              <div className="mb-4">
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Indirizzo
                </label>
                <p>{event.location}</p>
              </div>
            )}

            {event.notification && (
              <>
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Promemoria
                </label>
                <p className="mb-4">
                  {notificationTranslations[event.notification]}
                </p>
              </>
            )}

            {event.description && (
              <div className="mb-4">
                <label className="block py-2 text-[14px] text-[#64748B]">
                  Note
                </label>
                <p
                  className="max-h-24 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => setIsEditingMode(true)}
                className="text-base"
              >
                Modifica
              </Button>

              <Button
                variant="outline"
                className="border-[#e55934] text-base text-[#e55934] hover:border-none hover:bg-[#ea7a5d] hover:text-white"
                onClick={() => {
                  toast('Sei sicuro di voler eliminare questo evento?', {
                    action: {
                      label: 'Conferma',
                      onClick: () => {
                        onDelete(event);
                        toast.success('Evento eliminato con successo');
                      },
                    },
                    cancel: {
                      label: 'Annulla',
                      onClick: () => {
                        console.log('Azione annullata');
                      },
                    },
                  });
                }}
              >
                Elimina
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EventDetails;
