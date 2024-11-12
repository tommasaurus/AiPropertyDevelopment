import React, { useState, useEffect, useMemo } from "react";
import { MapPin, ChevronLeft, ChevronRight, Users } from "lucide-react";
import "./WeekView.css";

const WeekView = ({
  currentDate = new Date(),
  events = [],
  onDateChange,
  onEventClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Constants for time configuration
  const START_HOUR = 6; // Start at 6 AM
  const END_HOUR = 23; // End at 11 PM
  const HOURS = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => i + START_HOUR
  );
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get dates for the current week
  const weekDates = useMemo(() => {
    const dates = [];
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();

    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.getFullYear(), curr.getMonth(), first + i);
      dates.push(day);
    }
    return dates;
  }, [currentDate]);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Navigation between weeks
  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    onDateChange?.(newDate);
  };

  // Handle event click
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event, e);
    }
  };

  // Calculate event positioning and styling
  const getEventStyle = (event) => {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const duration = (event.end - event.start) / (1000 * 60 * 60); // Duration in hours
    const dayIndex = event.start.getDay();
    const leftPosition = (dayIndex / 7) * 100;

    return {
      top: `${(startHour - START_HOUR + startMinutes / 60) * 80}px`,
      height: `${duration * 80}px`,
      left: `${leftPosition}%`,
      width: `${100 / 7}%`,
    };
  };

  // Get current time indicator position
  const getCurrentTimeIndicator = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const dayIndex = now.getDay();

    if (hour < START_HOUR || hour > END_HOUR) return null;

    return {
      top: `${(hour - START_HOUR + minutes / 60) * 80}px`,
      left: `${(dayIndex / 7) * 100}%`,
      width: `${100 / 7}%`,
    };
  };

  // Format event time
  const formatEventTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format event duration for tooltip
  const getEventDuration = (event) => {
    const duration = (event.end - event.start) / (1000 * 60); // Duration in minutes
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className='week-view'>
      {/* Navigation Header */}
      <div className='week-nav-container'>
        <button
          className='week-nav-button'
          onClick={() => handleNavigate("prev")}
          aria-label='Previous week'
        >
          <ChevronLeft size={24} />
        </button>
        <div className='week-nav'>
          <div className='week-header'>
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`weekview-day-column-header ${
                  isToday(date) ? "today" : ""
                }`}
              >
                <span className='weekview-day-name'>{DAYS[index]}</span>
                <span className='weekview-day-number'>{date.getDate()}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className='week-nav-button'
          onClick={() => handleNavigate("next")}
          aria-label='Next week'
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className='week-body'>
        {/* Time Axis */}
        <div className='time-axis'>
          {HOURS.map((hour) => (
            <div key={hour} className='time-slot'>
              {hour === 12
                ? "12 PM"
                : hour > 12
                ? `${hour - 12} PM`
                : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Grid and Events */}
        <div className='week-grid'>
          {/* Grid Cells */}
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className='grid-cell'
                  data-hour={hour}
                  data-day={dayIndex}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Current Time Indicator */}
          {getCurrentTimeIndicator() && (
            <div
              className='current-time-indicator'
              style={getCurrentTimeIndicator()}
            >
              <div className='time-marker' />
              <div className='time-line' />
            </div>
          )}

          {/* Events */}
          {events.map((event, index) => (
            <div
              key={`${event.id || index}`}
              className={`week-event type-${event.type || "assignment"}`}
              style={getEventStyle(event)}
              title={`${event.title} (${getEventDuration(event)})`}
              onClick={(e) => handleEventClick(event, e)}
            >
              <div className='event-time'>
                {formatEventTime(event.start)} - {formatEventTime(event.end)}
              </div>
              <div className='event-title'>{event.title}</div>
              {event.location && (
                <div className='event-location'>
                  <MapPin size={12} />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className='event-attendees'>
                  <Users size={12} />
                  <span>{event.attendees.length} attendees</span>
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
