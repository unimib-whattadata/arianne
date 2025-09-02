import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTRPC } from '@/trpc/react';
import type { RouterOutputs } from '@arianne/api';

type Event = RouterOutputs['events']['getAll'][number];

interface WeekEventProps extends Event {
  onEventClick: (event: Event) => void;
  isFirstDay?: boolean;
  isFirstDayOfWeek?: boolean;
  dayPosition?: 'start' | 'middle' | 'end' | null;
  className?: string;
}

const WeekEvent: React.FC<WeekEventProps> = ({
  onEventClick,
  isFirstDay,
  dayPosition,
  isFirstDayOfWeek,
  ...event
}) => {
  const api = useTRPC();
  const therapist = useQuery(api.therapists.getAllPatients.queryOptions());

  const patientsName =
    therapist.data
      ?.filter((patient) => {
        event.participants.find((participant) => participant.id === patient.id);
      })
      .map((p) => p.profile.name) || [];

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

  const showBorder = isFirstDay ?? true;

  const borderStyle = showBorder
    ? (styles.border ?? 'border-l-gray-300')
    : 'border-transparent';

  const isMultiDay =
    event.isAllDay ||
    (event.date &&
      event.endDate &&
      new Date(event.date).toDateString() !==
        new Date(event.endDate).toDateString());

  const heightClass = isMultiDay ? 'h-[24px] flex-none' : 'h-full';

  const shouldShowTitle =
    !isMultiDay || (isMultiDay && (isFirstDay || isFirstDayOfWeek));

  return (
    <div
      className={`event-label w-fill z-10 mb-1 min-h-[24px] items-center truncate border-l-[6px] ${borderStyle} ${heightClass} p-1 ${
        dayPosition === 'start'
          ? 'rounded-l-sm'
          : dayPosition === 'end'
            ? 'rounded-r-sm'
            : dayPosition === null || dayPosition === undefined
              ? 'rounded-sm'
              : ''
      }`}
      style={{
        backgroundColor: event.labelColor || 'white',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
    >
      {shouldShowTitle && (
        <div className="gap-1">
          <h2 className={`w-full truncate text-xs text-[#64748b]`}>
            {event.participants.length > 0
              ? patientsName.join(', ')
              : event.name}
          </h2>
        </div>
      )}
    </div>
  );
};

export default WeekEvent;
