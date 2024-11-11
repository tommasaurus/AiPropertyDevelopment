import React, { useState } from 'react';
import './Calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import DayView from './DayView';

const Calendar = () => {
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: 'Weekly Meeting Projects',
      start: new Date(2024, 9, 14, 8, 0),
      end: new Date(2024, 9, 14, 9, 30),
      location: 'Corner Rounded St, London, United Kingdom',
      type: 'primary',
      attendees: ['JD', 'AB', 'CD', 'EF', 'GH']
    },    
    {
      id: 2,
      title: 'Maintenance Server',
      start: new Date(2024, 9, 14, 8, 30),
      end: new Date(2024, 9, 14, 9, 30),
      location: 'Corner Rounded St, London, United Kingdom',
      type: 'dark'
    },
    {
      id: 3,
      title: 'UI Design Weekly Workshop',
      start: new Date(2024, 9, 14, 10, 0),
      end: new Date(2024, 9, 14, 11, 30),
      location: 'Corner Rounded St, London, United Kingdom',
      type: 'success'
    },
    {
      id: 4,
      title: 'Meet Mr.Yuan in Airport',
      start: new Date(2024, 9, 14, 13, 0),
      end: new Date(2024, 9, 14, 14, 0),
      location: 'Corner Rounded St, London, United Kingdom',
      type: 'warning'
    }
  ];

  const getTodayDate = () => {
    return new Date().getDate();
  };
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const totalDays = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          <div className="day-number">
            <span>{prevMonthDays - i}</span>
          </div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = currentDay.toDateString() === new Date().toDateString();
      const dayEvents = events.filter((event) =>
        event.start.toDateString() === currentDay.toDateString()
      );

      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <div className="day-number">
            <span>{day}</span>
          </div>
          {dayEvents.map((event) => (
            <div key={event.id} className="event-item">
              <span className="event-title">{event.title}</span>
              {event.start.getHours() && event.end && (
                <span className="event-time">
                  {`${event.start.getHours().toString().padStart(2, '0')}:${event.start.getMinutes().toString().padStart(2, '0')} - ${event.end.getHours().toString().padStart(2, '0')}:${event.end.getMinutes().toString().padStart(2, '0')}`}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Next month days
    const remainingCells = 35 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-day other-month">
          <div className="day-number">
            <span>{i}</span>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-layout">
      <Sidebar />
      
      <main className="calendar-main">
        <div className="calendar-content">
          <div className="calendar-header">
            <div className="header-center">
              <div className="calendar-type">
                <button className="nav-button" onClick={handlePrevMonth}>
                  <ChevronLeft className="nav-icon" />                      
                </button>
                <span className="current-month">
                  {formatMonth(currentDate)}, {currentDate.getFullYear()}
                </span>
                <button className="nav-button" onClick={handleNextMonth}>
                  <ChevronRight className="nav-icon" />
                </button>
              </div>
            </div>
            <div className="header-left">
              <div className="view-options-container">
                <div className="view-options-wrapper">
                  {['Date', 'Week', 'Month'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCurrentView(view.toLowerCase())}
                      className={`view-option ${currentView === view.toLowerCase() ? 'active' : ''}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="header-right">
              <button className="today-button">Today ({getTodayDate()})</button>
              <button className="new-schedule-button">+ New Schedule</button>
            </div>
          </div>

          {currentView === 'date' ? (
            <DayView 
              currentDate={currentDate}
              events={events}
              onDateChange={(date) => setCurrentDate(date)}
            />
          ) : (
            <>
              <div className="calendar-days">
                <span className="day-label">Monday</span>
                <span className="day-label">Tuesday</span>
                <span className="day-label">Wednesday</span>
                <span className="day-label">Thursday</span>
                <span className="day-label">Friday</span>
                <span className="day-label">Saturday</span>
                <span className="day-label">Sunday</span>
              </div>
              <div className="calendar-grid">
                {renderCalendarDays()}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;