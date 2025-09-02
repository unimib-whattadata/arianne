import { isSameDay } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface CurrentTimeLineProps {
  day: Date;
  className?: string;
  isDayView: boolean;
}

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({
  day,
  className = '',
  isDayView,
}) => {
  const [currentLinePosition, setCurrentLinePosition] = useState(0);
  const rowHeightInPx = 64;
  const minutesInHour = 60;

  const getCurrentLinePosition = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentHour = now.getHours();

    return (
      ((currentHour * minutesInHour + currentMinutes) * rowHeightInPx) /
      minutesInHour
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLinePosition(getCurrentLinePosition());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentLinePosition(getCurrentLinePosition());
  }, []);

  const isToday = isSameDay(day, new Date());

  const dynamicWidthClass = isDayView
    ? 'w-[calc(100vw-40px)] sm:w-[calc(100vw-150px)] md:w-[calc(100vw-408px)]'
    : 'left-0 w-full';

  return (
    <div
      className={`absolute right-0 z-50 ${dynamicWidthClass} ${className}`}
      style={{
        top: `${currentLinePosition}px`,
        height: isToday ? '2px' : '1px',
        backgroundColor: '#e55934',
      }}
    >
      {isToday && (
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#e55934',
            position: 'absolute',
            left: '-5px',
            top: '-4px',
          }}
        />
      )}
    </div>
  );
};

export default CurrentTimeLine;
