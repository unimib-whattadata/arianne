import React from 'react';

// import { Calendar  } from '@/features/agenda/components/calendar';
import Month from '@/features/agenda/components/month';

export default function Agenda() {
  return (
    <>
      <main className="h-full">
        {/* <Calendar  
          
        /> */}

        <Month />
      </main>
    </>
  );
}
