'use client';

import { EyeOff, Plus } from 'lucide-react';
import React, { useState } from 'react';

import AssignmentTable from '@/features/dashboard/assignment-table';
import NextEventBanner from '@/features/dashboard/nex-event-banner';
import NotificationCard from '@/features/dashboard/notifications';
import PatientsTable from '@/features/dashboard/patients-table';
import StatsBar from '@/features/dashboard/stats-bar';
import { cn } from '@/utils/cn';

const PatientPage = () => {
  const [editMode, _setEditMode] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState<Record<string, boolean>>({
    stats: true,
    patients: true,
    assignments: true,
    notifications: true,
    events: true,
  });

  const toggleBlock = (key: string) => {
    const visibleCount = Object.values(visibleBlocks).filter(Boolean).length;
    if (visibleBlocks[key] && visibleCount === 1) return;
    setVisibleBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleCount = Object.values(visibleBlocks).filter(Boolean).length;
  const isOnlyEventsVisible = visibleCount === 1 && visibleBlocks.events;

  const renderBlock = (
    key: string,
    Component: React.ReactNode,
    className = '',
  ) => {
    const isVisible = visibleBlocks[key];
    const isEditingHidden = !isVisible && editMode;

    const shouldRender = editMode || isVisible;

    if (!shouldRender) return null;

    return (
      <div
        className={cn(
          'relative transition-all duration-300',
          editMode ? 'opacity-80' : '',
          isEditingHidden ? 'opacity-30' : '',
          className,
        )}
      >
        {editMode && (
          <button
            onClick={() => toggleBlock(key)}
            className="absolute top-2 right-2 z-50 rounded bg-white p-1 shadow"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        )}
        {Component}
      </div>
    );
  };

  const isSingleCol = !editMode && isOnlyEventsVisible;
  const _gridClasses = isSingleCol
    ? 'grid-cols-1 grid-rows-auto'
    : 'grid-cols-[auto_300px] grid-rows-auto';

  return (
    <main className="h-full-safe grid grid-cols-[1fr_300px] gap-3 p-4">
      <div className="bg-background sticky top-0 z-40 col-span-full flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        {/* <Button variant="outline" onClick={() => setEditMode((prev) => !prev)}>
          <Settings2 className="mr-2 h-4 w-4" />
          {editMode ? 'Salva' : 'Modifica schermata'}
        </Button> */}
      </div>

      <div
        className={cn(
          'grid h-fit gap-3 overflow-auto pr-2',
          isSingleCol ? 'hidden' : 'col-start-1',
        )}
      >
        {renderBlock('stats', <StatsBar />)}
        {renderBlock('patients', <PatientsTable />)}
        {renderBlock('assignments', <AssignmentTable />)}
        {renderBlock('notifications', <NotificationCard />)}
      </div>

      <div
        className={cn(
          '[--header-height:140px]',
          isSingleCol ? 'col-span-full' : 'h-full-safe col-start-2',
        )}
      >
        {renderBlock('events', <NextEventBanner />)}
      </div>
    </main>
  );
};

export default PatientPage;
