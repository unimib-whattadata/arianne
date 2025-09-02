import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { EllipsisVertical, Files, Pen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTRPC } from '@/trpc/react';
import type { RouterOutputs } from '@arianne/api';

type Event = RouterOutputs['events']['getAll'][number];

interface Props {
  events: Event[];
  onDuplicate: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const EventSearchTable: React.FC<Props> = ({
  events,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const [openPopoverIdx, setOpenPopoverIdx] = useState<number | null>(null);

  const api = useTRPC();
  const therapist = useQuery(api.therapists.getAllPatients.queryOptions());

  const getPatientsName = (event: Event) =>
    therapist.data
      ?.filter((patient) => {
        event.participants.find((participant) => participant.id === patient.id);
      })
      .map((p) => p.profile.name) || [];

  return (
    <div className="mt-3 overflow-x-auto bg-white px-4">
      <div className="w-full text-base">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between ${
                idx % 2 === 0 ? 'bg-[#f6f9fc]' : 'bg-white'
              } hover:bg-[#EFF3F7]`}
            >
              <div className="grid w-3/4 grid-cols-[auto_auto_minmax(100px,1fr)_1fr] gap-8">
                <p className="min-w-32 p-3">
                  {format(event.date, 'dd/MM/yyyy')}
                </p>
                <p className="min-w-32 p-3">{`${event.startTime} - ${event.endTime}`}</p>
                <p className="p-3">{getPatientsName(event)}</p>
                <p className="p-3">{event.name}</p>
              </div>
              <div className="p-3 text-center">
                <Popover
                  open={openPopoverIdx === idx}
                  onOpenChange={(open) => setOpenPopoverIdx(open ? idx : null)}
                >
                  <PopoverTrigger asChild>
                    <button onClick={() => setOpenPopoverIdx(idx)}>
                      <EllipsisVertical className="text-primary hover:bg-primary/10 h-7 w-7 rounded-sm p-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="border-primary/50 w-72 border-[0.5px] p-2"
                    side="left"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-base"
                        onClick={() => {
                          onDuplicate(event);
                          setOpenPopoverIdx(null);
                        }}
                      >
                        Duplica
                        <Files className="text-primary h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-base"
                        onClick={() => {
                          onEdit(event);
                          setOpenPopoverIdx(null);
                        }}
                      >
                        Modifica
                        <Pen className="text-primary h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="hover:text-red-70 w-full justify-between text-base text-[#e55936]"
                        onClick={() => {
                          setOpenPopoverIdx(null);

                          toast(
                            'Sei sicuro di voler eliminare questo evento?',
                            {
                              action: {
                                label: 'Conferma',
                                onClick: () => {
                                  onDelete(event);
                                  toast.success(
                                    'Evento eliminato con successo',
                                  );
                                },
                              },
                              cancel: {
                                label: 'Annulla',
                                onClick: () => {
                                  console.log('Azione annullata');
                                },
                              },
                            },
                          );
                        }}
                      >
                        Elimina
                        <Trash2 className="h-6 w-6 text-[#e55934]" />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-base text-gray-500">
            Nessun evento trovato
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSearchTable;
