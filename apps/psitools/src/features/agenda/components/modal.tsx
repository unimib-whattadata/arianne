import type { Event } from '@arianne/db';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
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

const handleCopyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Link copiato negli appunti!');
  } catch (err) {
    console.error('Errore nella copia:', err);
  }
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void;

  selectedDate: Date | null;
  events?: Event[];
  startTime?: string | null;
}

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

const defaultColors = [
  '#def2d9',
  '#f2d9de',
  '#d9ebf2',
  '#e2daf2',
  '#fce2d4',
  '#fdf4d0',
];

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  startTime,
  selectedDate,
}) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [patient, setPatient] = useState('');
  const [meetingLink, setMeetingLink] = useState<string | null | undefined>('');
  const [location, setLocation] = useState('');
  const [labelColor, setLabelColor] = useState('');
  const [eventDate, setEventDate] = useState(selectedDate || new Date());
  const [eventEndDate, setEventEndDate] = useState(selectedDate || new Date());
  const [endTime, setEndTime] = useState('17:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [_selectedString, setSelectedString] = useState<string>('');
  const [currentStartTime, setCurrentStartTime] = useState(startTime);
  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (startTime) {
      setCurrentStartTime(startTime);
    }
  }, [startTime]);

  const [repeat, setRepeat] = useState<
    | 'never'
    | 'everyDay'
    | 'everyWeek'
    | 'everyTwoWeeks'
    | 'everyThreeWeeks'
    | 'everyMonth'
  >('never');

  const [notificationLabel, setNotificationLabel] = useState<
    'no' | 'sameDay' | 'oneDayBefore' | 'twoDaysBefore'
  >();
  const [selected, setSelected] = useState<string[]>([]);

  const api = useTRPC();
  const queryClient = useQueryClient();
  const therapist = useQuery(api.therapist.getAllPatients.queryOptions());

  const options = therapist.data?.map((patient) => {
    return { label: patient.user?.name ?? '', value: patient.id ?? '' };
  });

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

  const resetModalFields = () => {
    setEventName('');
    setEventDescription('');
    setPatient('');
    setEventDate(selectedDate || new Date());
    setEventEndDate(selectedDate || new Date());
    setMeetingLink('');
    setLocation('');
    setCurrentStartTime(startTime ?? '09:00');
    setEndTime(
      startTime ? `${parseInt(startTime.split(':')[0]) + 1}:00` : '17:00',
    );
    setIsAllDay(false);
    setLabelColor(defaultColors[0]);
    setSelected([]);
    setSelectedString('');
    setRepeat('never');
    setNotificationLabel('no');
    setAdditionalParticipants([]);
  };

  useEffect(() => {
    if (isOpen) {
      resetModalFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedDate]);

  const createEvent = useMutation(
    api.event.create.mutationOptions({
      //TODO: Add toast notification
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const handleSave = () => {
    if (!eventName.trim()) {
      toast('Nome evento è obbligatorio');
      return;
    }

    const startDateTime = new Date(eventDate);
    const endDateTime = new Date(eventEndDate);

    if (!isAllDay) {
      const [startHour, startMinute] = (currentStartTime || '00:00')
        .split(':')
        .map(Number);
      const [endHour, endMinute] = (endTime || '00:00').split(':').map(Number);

      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);
    }

    if (endDateTime < startDateTime) {
      toast.error("La fine dell'evento non può essere prima dell'inizio.");
      return;
    }

    createEvent.mutate(
      {
        name: eventName,
        patientId: patient || undefined,
        date: eventDate,
        endDate: eventEndDate,
        meetingLink,
        location,
        startTime: currentStartTime ?? '08:00',
        endTime,
        isAllDay,
        notification: notificationLabel,
        labelColor: labelColor || '#ffffff',
        otherPartecipants: [...additionalParticipants],
        description: eventDescription,
        recurring: repeat,
      },

      {
        onSuccess: () => {
          toast.success('Evento creato con successo!');
          onClose();
        },
        onError: (error) => {
          toast.error(`Errore nella creazione dell'evento: ${error.message}`);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent className="overflow-y-auto py-0">
        <div className="sticky top-0 z-10 flex items-end justify-between bg-white py-4">
          <SheetTitle>Nuovo Evento</SheetTitle>
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
            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
              <PopoverTrigger asChild>
                <button
                  className="flex h-9 w-[74px] items-center justify-between rounded-md border border-gray-200 px-2 py-1"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: labelColor || defaultColors[0] }}
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
            defaultValue={''}
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
                onChange={(e) => handleParticipantChange(index, e.target.value)}
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
                  onSelect={(endDate) => endDate && setEventEndDate(endDate)}
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
              <SelectItem value="everyTwoWeeks">Ogni due settimane</SelectItem>
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
          <div className="relative grid grid-cols-[1fr,auto] gap-2">
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
            value={location}
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
          <Button onClick={handleSave} className="w-full text-base">
            Salva
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Modal;
