import type { RouterOutputs } from '@arianne/api';
import { MapPin, Sofa, User, Video } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Event = RouterOutputs['events']['getAllForPatients'][number];

interface PatientCalendarAppointment {
  event: Event;
}

export const PatientCalendarAppointment = (
  props: PatientCalendarAppointment,
) => {
  const { event } = props;
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-md bg-gray-100 p-2"
    >
      <AccordionItem className="border-b-0" value="appointment">
        <AccordionTrigger className="px-4 py-2 hover:no-underline">
          <div className="flex flex-row items-center gap-4">
            <div className="items-center justify-center rounded-full bg-pink-200 p-2">
              <Sofa />
            </div>
            <div className="flex flex-col items-start">
              <span>{event.therapist.profile.name}</span>
              <span className="text-base font-thin">
                {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 px-4 py-2 text-balance">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-6">
              <User />{' '}
              <span>
                {event.therapist.profile.firstName}{' '}
                {event.therapist.profile.lastName}, Tu
              </span>
            </div>
          </div>
          {event.location && (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row items-center gap-6">
                <MapPin /> <span>{event.location}</span>
              </div>
            </div>
          )}
          {event.meetingLink && (
            <div className="flex flex-col gap-2 p-2">
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center gap-6 hover:underline"
              >
                <Video /> <span>{event.meetingLink}</span>
              </a>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
