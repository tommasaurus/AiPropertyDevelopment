import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import './WeekView.css';

const WeekView = ({ currentDate, events, onDateChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  const timeslotHeight = 100;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getWeekDates = () => {
    const dates = [];
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();

    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.getFullYear(), curr.getMonth(), first + i);
      dates.push(day);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // **Handle Week Navigation**
  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange?.(newDate);
  };

  const getEventStyle = (event) => {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const duration = (event.end - event.start) / (1000 * 60 * 60);
    const dayIndex = event.start.getDay(); // 0 (Sunday) to 6 (Saturday)
    const leftPosition = (dayIndex / 7) * 100; // Percentage position

    return {
      top: `${((startHour - 7) + startMinutes / 60) * timeslotHeight}px`,
      height: `${duration * timeslotHeight}px`,
      left: `${leftPosition}%`,
      width: `${100 / 7}%`,
    };
  };

  const getCurrentTimeIndicator = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const dayIndex = now.getDay();

    if (hour < 7 || hour > 20) return null;

    return {
      top: `${((hour - 7) + minutes / 60) * timeslotHeight}px`,
      left: `${(dayIndex / 7) * 100}%`,
      width: `${100 / 7}%`,
    };
  };

  return (
    <div className="week-view">
      {/* Week Navigation */}
      <div className="week-nav-container">
        <button className="week-nav-button" onClick={() => handleNavigate('prev')}>
          <ChevronLeft size={24} />
        </button>
        <div className="week-nav">
          <div className="week-header">            
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`weekview-day-column-header ${isToday(date) ? 'today' : ''}`}
              >
                <span className="weekview-day-name">{days[index]}</span>
                <span className="weekview-day-number">{date.getDate()}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="week-nav-button" onClick={() => handleNavigate('next')}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="week-body">
        <div className="time-axis">
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        <div className="week-grid">
          {hours.map((hour) => (
            <div key={hour} className="hour-row">
              {Array.from({ length: 13 }).map((_, index) => (
                <div key={`${hour}-${index}`} className="grid-cell"></div>
              ))}
            </div>
          ))}

          {getCurrentTimeIndicator() && (
            <div
              className="current-time-indicator"
              style={getCurrentTimeIndicator()}
            >
              <div className="time-marker"></div>
              <div className="time-line"></div>
            </div>
          )}

          {events.map((event, index) => (
            <div
              key={index}
              className={`week-event type-${event.type || 'primary'}`}
              style={getEventStyle(event)}
            >
              <div className="event-title">{event.title}</div>
              {event.location && (
                <div className="event-location">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className="event-attendees">
                  {event.attendees.map((attendee, i) => (
                    <div key={i} className="attendee-avatar">
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

export default WeekView;
