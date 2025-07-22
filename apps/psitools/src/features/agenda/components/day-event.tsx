import type { Event } from '@arianne/db';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTRPC } from '@/trpc/react';

interface DayEventProps extends Event {
  onEventClick: (event: Event) => void;
}

const DayEvent: React.FC<DayEventProps> = ({ onEventClick, ...event }) => {
  const api = useTRPC();
  const therapist = useQuery(api.therapist.getAllPatients.queryOptions());

  const patientName =
    therapist.data?.find((p) => p.id === event?.patientId)?.user?.name ??
    event?.patientId;

  const labelColorStyles: Record<string, { border: string; text: string }> = {
    '#def2d9': { border: 'border-l-[#92d482]', text: 'text-[#489834]' },
    '#f2d9de': { border: 'border-l-[#EAB1BC]', text: 'text-[#DC7E93]' },
    '#d9ebf2': { border: 'border-l-[#9CCBDD]', text: 'text-[#3988A7]' },
    '#e2daf2': { border: 'border-l-[#a68ed7]', text: 'text-[#7751c2]' },
    '#fce2d4': { border: 'border-l-[#f8bfa0]', text: 'text-[#f27f40]' },
    '#fdf4d0': { border: 'border-l-[#FED948]', text: 'text-[#D2A909]' },
  };
  const styles = labelColorStyles[event.labelColor ?? ''] ?? {
    border: 'border-l-gray-300',
    text: 'text-gray-800',
  };
  return (
    <div
      className={`event-label z-10 mb-1 h-full w-full items-center truncate rounded-sm border-l-[6px] p-1 ${
        styles.border
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
    >
      <div className="gap-1">
        <h2 className="w-full truncate text-xs text-[#64748b]">
          {event.patientId ? patientName : event.name}
        </h2>
      </div>
    </div>
  );
};

export default DayEvent;
