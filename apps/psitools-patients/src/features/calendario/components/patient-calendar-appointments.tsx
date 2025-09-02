import { PatientCalendarAppointment } from '@/features/calendario/components/patient-calendar-appointment';
import type { Day } from '@/features/calendario/types';
import { isToday } from '@/features/calendario/utils';

interface PatientCalendarAppointmentsProps {
  day: Day;
}

export const PatientCalendarAppointments = (
  props: PatientCalendarAppointmentsProps,
) => {
  const { day: selectedDay } = props;
  return (
    <div className="flex flex-col gap-2">
      <span className="p-2">
        {isToday(
          selectedDay.date.getDate(),
          selectedDay.date.getMonth() + 1,
          selectedDay.date.getFullYear(),
        ) && 'Oggi, '}
        {selectedDay.date.toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </span>
      {selectedDay.appointments.length > 0 ? (
        selectedDay.appointments.map((event, index) => (
          <PatientCalendarAppointment key={index} event={event} />
        ))
      ) : (
        <p className="text-center">Nessun Appuntamento</p>
      )}
    </div>
  );
};
