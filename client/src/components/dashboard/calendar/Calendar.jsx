import React, { useState } from 'react';
import './Calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';

const Calendar = () => {
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: 'New Event',
      start: new Date(2020, 9, 8, 8, 4), // October 8
      end: new Date(2020, 9, 8, 10, 23),
      type: 'standard',
    },
    {
      id: 2,
      title: 'Event',
      start: new Date(2020, 9, 2), // October 2
      type: 'standard',
    },
    {
      id: 3,
      title: 'Event',
      start: new Date(2020, 9, 3), // October 3
      type: 'standard',
    },
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
                    {dayEvents.map((event, index) => (
                        <div key={event.id} className="event-item">
                            <span className="event-title">{event.title}</span>
                            {event.start.getHours() && (
                                <span className="event-time">
                                    {`${event.start.getHours().toString().padStart(2, '0')}:${event.start.getMinutes().toString().padStart(2, '0')} - ${event.end.getHours().toString().padStart(2, '0')}:${event.end.getMinutes().toString().padStart(2, '0')}`}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // Next month days to fill a 5x7 grid (35 cells)
        const remainingCells = 35 - days.length; // Changed from 42 to 35
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

    const ViewOptions = () => {
        const [currentView, setCurrentView] = useState('month');
        const views = ['Date', 'Week', 'Month', 'Year'];
        
        return (
          <div className="view-options-container">
            <div className="view-options-wrapper">
              {views.map((view) => (
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
        );
      };

      return (
        <div className="dashboard-layout">
          <Sidebar />
          
          <main className="dashboard-main">
            <div className="calendar-content">
              <div className="calendar-header">
                <div className="header-center">
                  <div className="calendar-type">
                    <button className="nav-button" onClick={handlePrevMonth}>
                      <ChevronRight alt="Previous" className="nav-icon prev" />                      
                    </button>
                    <span className="current-month">
                      {formatMonth(currentDate)}, {currentDate.getFullYear()}
                    </span>
                    <button className="nav-button" onClick={handleNextMonth}>
                      <ChevronRight alt="Next" className="nav-icon next" />
                    </button>
                  </div>
                </div>
                <div className="header-left">
                  <ViewOptions />
                </div>
                <div className="header-right">
                  <button className="today-button">Today ({getTodayDate()})</button>
                  <button className="new-schedule-button">+ New Schedule</button>
                </div>
              </div>
    
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
            </div>
          </main>
        </div>
      );
    };

export default Calendar;