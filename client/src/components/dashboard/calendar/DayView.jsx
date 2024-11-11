import './DayView.css';
import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const DayView = ({ currentDate, events, onDateChange }) => {
  // Use the current date for currentTime or set a specific time for testing
  const [currentTime, setCurrentTime] = useState(new Date());

  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  const timeslotHeight = 100; // Fixed height in pixels

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDayNumbers = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === currentDate.toDateString();
      days.push({ date, isToday, isSelected });
    }
    return days;
  };

  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange?.(newDate);
  };

  const getCurrentTimePosition = () => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hour < 7 || hour > 20) return null;
    const position = ((hour - 7) + minutes / 60) * timeslotHeight;
    return `${position}px`;
  };

  const getEventStyle = (event) => {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const duration =
      event.end ? (event.end - event.start) / (1000 * 60 * 60) : 1;

    return {
      top: `${((startHour - 7) + startMinutes / 60) * timeslotHeight}px`,
      height: `${duration * timeslotHeight}px`,
    };
  };

  const isCurrentDateToday =
    currentDate.toDateString() === new Date().toDateString();

  // **Filter events to include only those occurring on the currentDate**
  const filteredEvents = events.filter(
    (event) => event.start.toDateString() === currentDate.toDateString()
  );

  return (
    <div className="dateview-content">
      <div className="dateview-nav">
        <button
          className="dateview-nav-button"
          onClick={() => handleNavigate('prev')}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="dateview-selector">
          {getDayNumbers().map(({ date, isToday, isSelected }) => (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange?.(date)}
              className={`dateview-item ${isSelected ? 'dateview-selected' : ''} ${
                isToday ? 'dateview-today' : ''
              }`}
            >
              <span className="dateview-dayname">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="dateview-daynumber">{date.getDate()}</span>
            </button>
          ))}
        </div>
        <button
          className="dateview-nav-button"
          onClick={() => handleNavigate('next')}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="dateview-body">
        <div className="dateview-timeline">
          {hours.map((hour) => (
            <div key={hour} className="dateview-timeslot">
              {hour === 12
                ? `${hour} PM`
                : hour < 12
                ? `${hour} AM`
                : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        <div className="dateview-grid">
          {hours.map((hour) => (
            <div key={hour} className="dateview-hourline" />
          ))}

          {isCurrentDateToday && getCurrentTimePosition() && (
            <div
              className="dateview-currenttime"
              style={{ top: getCurrentTimePosition() }}
            >
              <div className="dateview-currenttime-dot" />
              <div className="dateview-currenttime-line" />
            </div>
          )}

          {/* Use filteredEvents instead of events */}
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`dateview-event type-${event.type || 'primary'}`}
              style={getEventStyle(event)}
            >
              <div className="dateview-event-title">{event.title}</div>
              {event.location && (
                <div className="dateview-event-location">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className="dateview-event-attendees">
                  {event.attendees.map((attendee, i) => (
                    <div key={i} className="dateview-attendee">
                      {attendee}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
