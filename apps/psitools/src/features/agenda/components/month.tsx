'use client';

import type { Event } from '@arianne/db';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import Modal from '@/features/agenda/components/modal';
import NavigationBar from '@/features/agenda/components/navbar';
import EventSearchTable from '@/features/agenda/components/results-table';
import { useTRPC } from '@/trpc/react';

import DayEvent from './day-event';
import EventDetails from './event-details';
import CurrentTimeLine from './hour-line';
import MonthEvent from './month-event';
import WeekEvent from './week-event';

const Month: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const allDayContainerRef = useRef<HTMLDivElement>(null);
  const [_isOverflowing, setIsOverflowing] = useState(false);

  const openModal = (day: Date, hour?: string) => {
    resetModalFields();

    setSelectedCell(day);
    setIsModalOpen(true);
    setSelectedEvent(null);

    if ((view === 'week' && hour) || (view === 'day' && hour)) {
      setSelectedEvent((prev) => ({
        ...prev!,
        startTime: hour,
        endTime: `${parseInt(hour.split(':')[0]) + 1}:00`,
      }));
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (view === 'week' && scrollContainerRef.current) {
      const desiredSlotIndex = 16;
      const slotHeight = 32;
      const allDayHeight = 50;
      scrollContainerRef.current.scrollTop =
        allDayHeight + desiredSlotIndex * slotHeight;
    } else if (view === 'day' && scrollContainerRef.current) {
      const desiredSlotIndex = 12;
      const slotHeight = 32;
      const allDayHeight = 50;
      scrollContainerRef.current.scrollTop =
        allDayHeight + desiredSlotIndex * slotHeight;
    }
  }, [view]);

  const openEventDetails = (event: Event, editing = false) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
    setIsEditingMode(editing);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  const resetModalFields = () => {
    setSelectedEvent(defaultEvent);
  };

  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: eventList, isLoading } = useQuery(
    api.event.getAll.queryOptions(),
  );
  const createEvent = useMutation(
    api.event.create.mutationOptions({
      //TODO: Add toast notification
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const deleteEvent = useMutation(
    api.event.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const updateEvent = useMutation(
    api.event.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.event.getAll.queryFilter());
      },
    }),
  );

  const onDuplicateEvent = (event: Event) => {
    const duplicatedEvent: Event = {
      ...event,
      id: '',
      name: `${event.name} (copia)`,
      endTime: event.endTime,
      isAllDay: event.isAllDay,
      labelColor: event.labelColor,
      location: event.location,
      meetingLink: event.meetingLink,
      otherPartecipants: event.otherPartecipants,
      therapistId: event.therapistId,
      patientId: event.patientId,
      recurring: event.recurring,
      description: event.description,
      notification: event.notification,
      endDate: event.endDate,
    };

    setSelectedEvent(duplicatedEvent);
    setIsEditingMode(true);
    setIsEventDetailsOpen(true);
  };

  const defaultEvent: Event = {
    id: '',
    therapistId: '',
    name: '',
    patientId: '',
    date: new Date(),
    endDate: new Date(),
    meetingLink: '',
    location: '',
    labelColor: '#000000',
    startTime: '9:00',
    endTime: '10:00',
    isAllDay: false,
    otherPartecipants: [],
  };

  const [searchValue, setSearchValue] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null);

  const therapist = useQuery(api.therapist.getAllPatients.queryOptions());
  const patients = useMemo(() => therapist.data || [], [therapist.data]);
  useEffect(() => {
    if (!searchValue || !eventList || !patients) {
      setFilteredEvents(null);
      return;
    }

    const lowerSearch = searchValue.toLowerCase();

    const results = eventList.filter((event) => {
      const patient = patients.find((p) => p.id === event.patientId);
      const patientName = patient?.user?.name?.toLowerCase() ?? '';

      return (
        event.name.toLowerCase().includes(lowerSearch) ||
        patientName.includes(lowerSearch)
      );
    });

    setFilteredEvents(results);
  }, [searchValue, eventList, patients]);

  useEffect(() => {
    const checkOverflow = () => {
      const container = allDayContainerRef.current;
      if (container) {
        setIsOverflowing(container.scrollHeight > 72);
      }
    };

    checkOverflow();
  }, [eventList, selectedDate]);

  const searchParams = useSearchParams();
  const selectedEventId = searchParams.get('eventId');
  useEffect(() => {
    if (selectedEventId && eventList) {
      const eventToOpen = eventList.find((e) => e.id === selectedEventId);
      if (eventToOpen) {
        openEventDetails(eventToOpen);
      }
    }
  }, [selectedEventId, eventList]);

  const renderMonthView = () => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startWeek = startOfWeek(startMonth, { locale: it });
    const endWeek = endOfWeek(endMonth, { locale: it });
    const days = eachDayOfInterval({ start: startWeek, end: endWeek });
    const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    const eventGridByDay: Record<string, (Event | null)[]> = {};

    const eventsSorted = [...(eventList ?? [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    for (const event of eventsSorted) {
      const start = startOfDay(new Date(event.date));
      const end = event.endDate ? endOfDay(new Date(event.endDate)) : start;
      if (end < start) continue;

      const daysInRange = eachDayOfInterval({ start, end });

      let slotIndex = 0;
      while (
        daysInRange.some((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const slots = eventGridByDay[key] || [];
          return slots[slotIndex];
        })
      ) {
        slotIndex++;
      }

      for (const day of daysInRange) {
        const key = format(day, 'yyyy-MM-dd');
        if (!eventGridByDay[key]) {
          eventGridByDay[key] = [];
        }

        while (eventGridByDay[key].length <= slotIndex) {
          eventGridByDay[key].push(null);
        }

        eventGridByDay[key][slotIndex] = event;
      }
    }

    if (isLoading || !eventList) return null;

    return (
      <div className="mx-auto flex h-full flex-col">
        <div className="sticky top-0 z-10 bg-white">
          <NavigationBar
            view={view}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setView={setView}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="sticky top-14 z-10 grid grid-cols-7 bg-white text-center font-semibold">
          {weekDays.map((day, index) => (
            <div key={index} className="border-gray-200 p-2 text-[14px]">
              {day}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto border-[0.5px] border-[#ccdbef]">
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const isInCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const isFirstColumn = index % 7 === 0;
              const isFirstRow = index < 7;

              const dateStr = format(day, 'yyyy-MM-dd');
              const rowSlots = eventGridByDay[dateStr] || [];
              const maxVisibleEvents = 3;
              const visibleSlots = rowSlots.slice(0, maxVisibleEvents);
              const hiddenCount = rowSlots
                .slice(maxVisibleEvents)
                .filter(Boolean).length;

              return (
                <div
                  key={index}
                  className={`flex h-36 cursor-pointer flex-col items-start p-2 text-sm hover:bg-[#f6f9fc] ${isInCurrentMonth ? '' : 'text-gray-400'} border-[#ccdbef] ${!isFirstColumn ? 'border-l-[0.5px]' : ''} ${!isFirstRow ? 'border-t-[0.5px]' : ''}`}
                  onClick={(e) => {
                    const clickedOnEventLabel = (
                      e.target as HTMLElement
                    ).closest('.event-label');
                    const clickedOnEditIcon = (e.target as HTMLElement).closest(
                      '.edit-icon',
                    );

                    if (!clickedOnEventLabel && !clickedOnEditIcon) {
                      openModal(day);
                    }
                  }}
                >
                  <span
                    className={`mb-1 h-6 w-6 text-xs ${isToday ? 'mb-1 flex h-6 w-6 items-center justify-center rounded-sm bg-[#e55934] text-white' : ''}`}
                  >
                    {format(day, 'd', { locale: it })}
                  </span>

                  {visibleSlots.map((event, slotIndex) => {
                    if (event) {
                      const isFirstDay =
                        format(
                          startOfDay(new Date(event.date)),
                          'yyyy-MM-dd',
                        ) === dateStr;

                      const isLastDay = event.endDate
                        ? format(
                            endOfDay(new Date(event.endDate)),
                            'yyyy-MM-dd',
                          ) === dateStr
                        : true;

                      let dayPosition: 'start' | 'middle' | 'end' | null = null;
                      if (event.endDate) {
                        if (isFirstDay && !isLastDay) dayPosition = 'start';
                        else if (!isFirstDay && !isLastDay)
                          dayPosition = 'middle';
                        else if (!isFirstDay && isLastDay) dayPosition = 'end';
                      }

                      return (
                        <div className="w-full" key={`${dateStr}-${slotIndex}`}>
                          <MonthEvent
                            {...event}
                            isFirstDay={isFirstDay}
                            dayPosition={dayPosition}
                            onEventClick={() => openEventDetails(event)}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`${dateStr}-empty-${slotIndex}`}
                          style={{ height: '26px' }}
                        />
                      );
                    }
                  })}

                  {hiddenCount > 0 && (
                    <div
                      className={`mt-1 cursor-pointer text-center text-xs text-primary underline`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(day);
                        setCurrentDate(day);
                        setView('week');
                      }}
                    >
                      Altri {hiddenCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startWeek = startOfWeek(selectedDate, { locale: it });

    const days = Array.from({ length: 7 }).map((_, i) => addDays(startWeek, i));
    const hours = Array.from({ length: 48 }).map((_, i) => {
      const hour = Math.floor(i / 2);
      const minutes = i % 2 === 0 ? '00' : '30';
      return `${hour}:${minutes}`;
    });

    const generateEventGrid = (days: Date[], events: Event[]) => {
      const grid: Record<string, (Event | null)[]> = {};
      const slotMap = new Map<string, number>();
      const maxSlotsPerDay: Record<string, number> = {};

      days.forEach((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        grid[dateStr] = [];
        maxSlotsPerDay[dateStr] = 0;
      });

      events.forEach((event) => {
        if (!event.isAllDay && (!event.date || !event.endDate)) return;

        const start = startOfDay(event.date);
        const end = endOfDay(event.endDate || event.date);
        const eventRange = eachDayOfInterval({ start, end });

        let assignedSlot = slotMap.get(event.id);
        if (assignedSlot == null) {
          let maxSlot = 0;
          while (
            eventRange.some((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              return grid[dateStr]?.[maxSlot];
            })
          ) {
            maxSlot++;
          }
          assignedSlot = maxSlot;
          slotMap.set(event.id, assignedSlot);
        }

        eventRange.forEach((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          if (!grid[dateStr]) grid[dateStr] = [];

          while (grid[dateStr].length <= assignedSlot) {
            grid[dateStr].push(null);
          }

          grid[dateStr][assignedSlot] = event;

          maxSlotsPerDay[dateStr] = Math.max(
            maxSlotsPerDay[dateStr],
            grid[dateStr].length,
          );
        });
      });

      Object.keys(grid).forEach((dateStr) => {
        const slots = grid[dateStr];
        const desiredLength = maxSlotsPerDay[dateStr];
        while (slots.length < desiredLength) {
          slots.push(null);
        }
      });

      return grid;
    };

    const renderEvents = (day: Date, hourIndex: number) => {
      if (!eventList) return null;

      const eventsForSlot = eventList.filter((event) => {
        if (event.isAllDay) return false;

        const isMultiDay =
          event.date &&
          event.endDate &&
          !isSameDay(startOfDay(event.date), endOfDay(event.endDate));

        return (
          !isMultiDay &&
          isSameDay(event.date, day) &&
          event.startTime &&
          event.endTime
        );
      });

      const eventsCount = eventsForSlot.length;

      if (eventsCount === 0) return null;

      const isOverlapping = (event1: Event, event2: Event) => {
        const start1 = event1.startTime
          ? parseInt(event1.startTime.split(':')[0]) * 60 +
            parseInt(event1.startTime.split(':')[1])
          : 0;
        const end1 = event1.endTime
          ? parseInt(event1.endTime.split(':')[0]) * 60 +
            parseInt(event1.endTime.split(':')[1])
          : 0;
        const start2 = event2.startTime
          ? parseInt(event2.startTime.split(':')[0]) * 60 +
            parseInt(event2.startTime.split(':')[1])
          : 0;
        const end2 = event2.endTime
          ? parseInt(event2.endTime.split(':')[0]) * 60 +
            parseInt(event2.endTime.split(':')[1])
          : 0;

        return start1 < end2 && start2 < end1;
      };

      const groupEvents = () => {
        const groups: Event[][] = [];

        eventsForSlot.forEach((event) => {
          let foundGroup = false;

          for (const group of groups) {
            if (group.some((e) => isOverlapping(e, event))) {
              group.push(event);
              foundGroup = true;
              break;
            }
          }

          if (!foundGroup) {
            groups.push([event]);
          }
        });

        return groups;
      };

      const groups = groupEvents();

      const gap = 1;

      return groups.map((group, _) => {
        const groupSize = group.length;
        const availableWidth = 100 - gap * (groupSize - 1);
        const eventWidth = availableWidth / groupSize;

        return group.map((event, eventIndex) => {
          if (!event.startTime || !event.endTime) return null;

          const startHour = parseInt(event.startTime.split(':')[0]);
          const startMinutes = parseInt(event.startTime.split(':')[1]);
          const endHour = parseInt(event.endTime.split(':')[0]);
          const endMinutes = parseInt(event.endTime.split(':')[1]);

          const startSlot = startHour * 2 + (startMinutes >= 30 ? 1 : 0);
          const endSlot = endHour * 2 + (endMinutes >= 30 ? 1 : 0);

          if (hourIndex === startSlot) {
            const left = `calc(${eventIndex * (eventWidth + gap)}%)`;

            return (
              <div
                key={eventIndex}
                className="absolute z-10 w-full rounded-sm"
                style={{
                  top: 0,
                  height: `${(endSlot - startSlot) * 2}rem`,
                  width: `${eventWidth}%`,
                  left,
                  backgroundColor: event.labelColor || 'white',
                }}
              >
                <WeekEvent
                  {...event}
                  onEventClick={() => openEventDetails(event)}
                />
              </div>
            );
          }
          return null;
        });
      });
    };

    return (
      <div className="mx-auto h-full">
        <div className="sticky top-0 z-10 bg-white">
          <NavigationBar
            view={view}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setView={setView}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="sticky top-14 z-30 grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-white text-center text-sm font-semibold">
          <div className="p-2"></div>
          {days.map((day, index) => {
            if (!eventList) return null;

            return (
              <div className="grid-col col-span-1" key={index}>
                <div className={`relative py-2 capitalize`}>
                  {format(day, 'EEE d', { locale: it })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-8 grid grid-cols-[50px_repeat(7,1fr)] bg-white">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 focus:outline-none"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {days.map((day, dayIndex) => {
            if (!eventList) return null;

            const allDayEvents = eventList.filter(
              (e) =>
                e.isAllDay ||
                (e.date && e.endDate && isBefore(e.date, e.endDate)),
            );

            const eventGridByDay = generateEventGrid(days, allDayEvents);
            const dateStr = format(day, 'yyyy-MM-dd');
            const eventsInSlots = eventGridByDay[dateStr] || [];

            return (
              <div
                key={dayIndex}
                ref={dayIndex === 0 ? allDayContainerRef : null}
                className={`relative flex flex-col items-start pt-2 transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[1000px]' : 'max-h-[68px] overflow-hidden'
                } ${isSameDay(day, new Date()) ? 'bg-[#f6f9fc]' : ''}`}
                style={{
                  borderLeft: dayIndex === 0 ? 'none' : '0.5px solid #ccdbef',
                }}
              >
                {eventsInSlots.map((event, slotIndex) => {
                  if (!event)
                    return (
                      <div key={slotIndex} className="h-7 min-h-7 w-full" />
                    );

                  const isFirstDay =
                    format(startOfDay(new Date(event.date)), 'yyyy-MM-dd') ===
                    dateStr;

                  const isLastDay = event.endDate
                    ? format(
                        endOfDay(new Date(event.endDate)),
                        'yyyy-MM-dd',
                      ) === dateStr
                    : true;

                  const eventStart = startOfDay(new Date(event.date));
                  const eventEnd = endOfDay(
                    new Date(event.endDate ?? event.date),
                  );
                  const isFirstDayOfWeek =
                    isSameDay(day, startWeek) &&
                    eventStart < startWeek &&
                    eventEnd >= day;

                  let dayPosition: 'start' | 'middle' | 'end' | null = null;
                  if (event.endDate) {
                    if (isFirstDay && !isLastDay) dayPosition = 'start';
                    else if (!isFirstDay && !isLastDay) dayPosition = 'middle';
                    else if (!isFirstDay && isLastDay) dayPosition = 'end';
                  }

                  return (
                    <div
                      className={`event-label z-10 mb-1 h-[24px] min-h-[24px] w-full items-center truncate ${
                        dayPosition === 'start'
                          ? 'ml-1 rounded-l-sm'
                          : dayPosition === 'end'
                            ? 'mr-1 rounded-r-sm'
                            : dayPosition === null || dayPosition === undefined
                              ? 'mx-1 rounded-sm'
                              : ''
                      }`}
                      style={{
                        backgroundColor: event.labelColor || 'white',
                      }}
                    >
                      <WeekEvent
                        {...event}
                        isFirstDay={isFirstDay}
                        isFirstDayOfWeek={isFirstDayOfWeek}
                        dayPosition={dayPosition}
                        onEventClick={() => openEventDetails(event)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-y-auto no-scrollbar"
          style={{ maxHeight: 'calc(100vh - 320px)' }}
        >
          <div className="relative grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
            {hours.map((hour, hourIndex) => {
              const isFullHour = hour.includes(':00');

              return (
                <React.Fragment key={hourIndex}>
                  <div className="relative z-30 bg-white p-2 text-sm text-gray-600">
                    {isFullHour && hour !== '0:00' && (
                      <span className="absolute -top-2.5">{hour}</span>
                    )}
                  </div>

                  {days.map((day, dayIndex) => {
                    const isToday = isSameDay(day, new Date());

                    return (
                      <Fragment key={dayIndex}>
                        <div
                          key={`${hourIndex}-${dayIndex}`}
                          className={`relative h-8 cursor-pointer p-2 hover:bg-[#f6f9fc] ${isToday ? 'bg-[#f6f9fc] hover:bg-[#eef3f8]' : ''}`}
                          style={{
                            borderTop: `${hour.includes(':00') ? '#ccdbef 1px' : '1px #E5EDF7'} solid`,
                            borderLeft:
                              dayIndex === 0 ? 'none' : '0.5px solid #ccdbef',
                          }}
                          onClick={(e) => {
                            const clickedOnEventLabel = (
                              e.target as HTMLElement
                            ).closest('.event-label');
                            const clickedOnEditIcon = (
                              e.target as HTMLElement
                            ).closest('.edit-icon');
                            if (!clickedOnEventLabel && !clickedOnEditIcon) {
                              openModal(day, hour);
                            }
                          }}
                        >
                          {hourIndex === 0 && (
                            <CurrentTimeLine day={day} isDayView={false} />
                          )}

                          {renderEvents(day, hourIndex)}
                        </div>
                      </Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 48 }).map((_, i) => {
      const hour = Math.floor(i / 2);
      const minutes = i % 2 === 0 ? '00' : '30';
      return `${hour}:${minutes}`;
    });

    if (!eventList) return null;

    const eventsForDay = eventList.filter((event) => {
      const start = startOfDay(new Date(event.date));
      const rawEnd = event.endDate
        ? new Date(event.endDate)
        : new Date(event.date);
      const end = endOfDay(rawEnd);

      const isMultiDay = !isSameDay(start, end);

      if (isMultiDay && !event.isAllDay) {
        return false;
      }

      return isSameDay(event.date, selectedDate);
    });

    const allDayEvents = eventList.filter((event) => {
      const start = startOfDay(new Date(event.date));
      const rawEnd = event.endDate
        ? new Date(event.endDate)
        : new Date(event.date);
      const end = endOfDay(rawEnd);

      if (isAfter(start, end)) return false;

      const isMultiDay = !isSameDay(start, end);
      const coversSelectedDate = isWithinInterval(selectedDate, { start, end });

      return (event.isAllDay || isMultiDay) && coversSelectedDate;
    });

    const timedEvents = eventsForDay.filter((event) => !event.isAllDay);

    const isOverlapping = (event1: Event, event2: Event) => {
      const start1 = event1.startTime
        ? parseInt(event1.startTime.split(':')[0]) * 60 +
          parseInt(event1.startTime.split(':')[1])
        : 0;
      const end1 = event1.endTime
        ? parseInt(event1.endTime.split(':')[0]) * 60 +
          parseInt(event1.endTime.split(':')[1])
        : 0;
      const start2 = event2.startTime
        ? parseInt(event2.startTime.split(':')[0]) * 60 +
          parseInt(event2.startTime.split(':')[1])
        : 0;
      const end2 = event2.endTime
        ? parseInt(event2.endTime.split(':')[0]) * 60 +
          parseInt(event2.endTime.split(':')[1])
        : 0;

      return start1 < end2 && start2 < end1;
    };

    const groupEvents = () => {
      const groups: Event[][] = [];

      timedEvents.forEach((event) => {
        let foundGroup = false;

        for (const group of groups) {
          if (group.some((e) => isOverlapping(e, event))) {
            group.push(event);
            foundGroup = true;
            break;
          }
        }

        if (!foundGroup) {
          groups.push([event]);
        }
      });

      return groups;
    };

    const groups = groupEvents();
    const gap = 0.5;

    return (
      <div className="mx-auto h-full w-full">
        <div className="sticky top-0 z-10 bg-white">
          <NavigationBar
            view={view}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setView={setView}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <p className="ml-20 text-base font-semibold capitalize">
          {format(selectedDate, 'eee d', { locale: it })}
        </p>
        <div className="sticky top-14 z-10 grid grid-cols-[20px_1fr] gap-5 bg-white">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 focus:outline-none"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </Button>

          <div
            className={`relative mt-2 transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[1000px]' : 'max-h-[68px] overflow-hidden'
            }`}
          >
            {allDayEvents.map((event, index) => (
              <div
                key={index}
                className="event-label z-10 mb-1 h-[24px] min-h-[24px] w-full truncate rounded-sm"
                style={{
                  backgroundColor:
                    event.labelColor.toLowerCase() === '#ffffff'
                      ? '#e5e7eb'
                      : event.labelColor,
                }}
              >
                <DayEvent
                  {...event}
                  onEventClick={() => openEventDetails(event)}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="h-[calc(100vh-330px)] overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 130px)' }}
        >
          {hours.map((hour, hourIndex) => {
            const isFullHour = hour.includes(':00');

            return (
              <div
                key={hourIndex}
                className="relative grid grid-cols-[40px_1fr]"
              >
                <div className="relative z-30 bg-white pr-2 text-sm text-gray-600">
                  {isFullHour && hour !== '0:00' && (
                    <span className="absolute bg-white">{hour}</span>
                  )}
                </div>
                {hourIndex === 0 && (
                  <CurrentTimeLine day={selectedDate} isDayView={true} />
                )}

                <div
                  className={`relative h-8 cursor-pointer border-t p-2 hover:bg-[#f6f9fc] ${
                    isFullHour
                      ? 'border-t border-[#ccdbef]'
                      : 'border-t border-[#E5EDF7]'
                  }`}
                  onClick={() => openModal(selectedDate, hour)}
                >
                  {groups.map((group, _) =>
                    group.map((event, eventIndex) => {
                      if (!event.startTime || !event.endTime) return null;

                      const startHour = parseInt(event.startTime.split(':')[0]);
                      const startMinutes = parseInt(
                        event.startTime.split(':')[1],
                      );
                      const endHour = parseInt(event.endTime.split(':')[0]);
                      const endMinutes = parseInt(event.endTime.split(':')[1]);

                      const startSlot =
                        startHour * 2 + (startMinutes >= 30 ? 1 : 0);
                      const endSlot = endHour * 2 + (endMinutes >= 30 ? 1 : 0);

                      if (hourIndex === startSlot) {
                        const eventWidth = 100 / group.length - gap;
                        const left = `calc(${eventIndex * (eventWidth + gap)}%)`;

                        return (
                          <div
                            key={eventIndex}
                            className="absolute left-0 z-10 rounded-sm"
                            style={{
                              top: 0,
                              height: `${(endSlot - startSlot) * 2}rem`,
                              width: `${eventWidth}%`,
                              left,
                              backgroundColor: event.labelColor || 'white',
                              border:
                                event.labelColor === '#ffffff'
                                  ? '1px solid #d1d5db'
                                  : 'none',
                            }}
                          >
                            <DayEvent
                              {...event}
                              onEventClick={() => openEventDetails(event)}
                            />
                          </div>
                        );
                      }
                      return null;
                    }),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!eventList) return null;

  return (
    <>
      <div className="mx-4 grid h-full gap-4">
        <div className="flex w-full items-center justify-end gap-2">
          <SearchInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            cleanFn={() => setSearchValue('')}
            placeholder="Cerca evento o paziente"
            className="ml-auto"
          />

          <Button
            variant="default"
            className="text-[14px] font-light text-white"
            onClick={() => {
              resetModalFields();
              openModal(new Date());
            }}
          >
            Nuovo Evento
          </Button>
        </div>
        <div className="relative h-[calc(100vh-127px)] min-h-[600px] rounded-md bg-white px-10 pb-10 pt-7">
          {filteredEvents ? (
            <div className="absolute inset-0 overflow-auto">
              <EventSearchTable
                events={filteredEvents}
                onDelete={deleteEvent.mutate}
                onEdit={(event) => openEventDetails(event, true)}
                onDuplicate={onDuplicateEvent}
              />
            </div>
          ) : view === 'month' ? (
            renderMonthView()
          ) : view === 'week' ? (
            renderWeekView()
          ) : (
            renderDayView()
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(event) => {
            createEvent.mutate(event);
            setIsEventDetailsOpen(false);
          }}
          selectedDate={selectedCell}
          startTime={selectedEvent?.startTime}
        />

        {selectedEvent && (
          <EventDetails
            isOpen={isEventDetailsOpen}
            onClose={() => {
              setIsEventDetailsOpen(false);
              setIsEditingMode(false);
            }}
            event={selectedEvent}
            onDelete={(event) => {
              deleteEvent.mutate({ id: event.id });
              setIsEventDetailsOpen(false);
            }}
            onSave={(event) => {
              updateEvent.mutate({ id: event.id });
              setIsEventDetailsOpen(false);
            }}
            isEditingModeTrigger={isEditingMode}
          />
        )}
      </div>
    </>
  );
};

export default Month;
