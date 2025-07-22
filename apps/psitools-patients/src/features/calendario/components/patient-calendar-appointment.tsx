import type { Event } from '@prisma/client';
import { MapPin, Sofa, User, Video } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { EventWithTherapist } from '@/features/calendario/types';

interface PatientCalendarAppointment {
  event: Event;
}

export const PatientCalendarAppointment = (
  props: PatientCalendarAppointment,
) => {
  const { event } = props;
  const eventWithTherapist = event as EventWithTherapist;
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
              <span>{eventWithTherapist.name}</span>
              <span className="text-base font-thin">
                {eventWithTherapist.startTime} - {eventWithTherapist.endTime}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance px-4 py-2">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-6">
              <User />{' '}
              <span>
                {eventWithTherapist.therapist.user.firstName}{' '}
                {eventWithTherapist.therapist.user.lastName}, Tu
              </span>
            </div>
          </div>
          {eventWithTherapist.location && (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row items-center gap-6">
                <MapPin /> <span>{eventWithTherapist.location}</span>
              </div>
            </div>
          )}
          {eventWithTherapist.meetingLink && (
            <div className="flex flex-col gap-2 p-2">
              <a
                href={eventWithTherapist.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center gap-6 hover:underline"
              >
                <Video /> <span>{eventWithTherapist.meetingLink}</span>
              </a>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
