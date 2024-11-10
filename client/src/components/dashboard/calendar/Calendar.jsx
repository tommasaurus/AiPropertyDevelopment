// CalendarPage.jsx
import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import SearchBar from '../searchBar/SearchBar';
import './CalendarPage.css';

const CalendarPage = () => {
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Property Viewing - 123 Main St",
      start: new Date(2024, 10, 15, 14, 0),
      end: new Date(2024, 10, 15, 15, 30),
      type: "viewing",
      description: "Potential tenant viewing for 2-bedroom apartment",
      location: "123 Main St, Unit 4B",
      contact: "John Smith (555) 123-4567"
    },
    {
      id: 2,
      title: "Maintenance - Plumbing Fix",
      start: new Date(2024, 10, 18, 10, 0),
      end: new Date(2024, 10, 18, 12, 0),
      type: "maintenance",
      description: "Emergency repair for leaking pipe in bathroom",
      location: "456 Oak Ave, Unit 2A",
      contact: "Mike's Plumbing Service"
    },
    {
      id: 3,
      title: "Rent Collection - Building A",
      start: new Date(2024, 10, 1, 9, 0),
      end: new Date(2024, 10, 1, 17, 0),
      type: "payment",
      description: "Monthly rent collection for Building A residents",
      location: "Building A Office",
      contact: "Property Manager"
    },
    {
      id: 4,
      title: "Property Inspection",
      start: new Date(2024, 10, 22, 13, 0),
      end: new Date(2024, 10, 22, 16, 0),
      type: "inspection",
      description: "Annual property inspection for insurance compliance",
      location: "All Building C Units",
      contact: "Inspector Joe Brown"
    },
    {
      id: 5,
      title: "Lease Signing - Unit 2A",
      start: new Date(2024, 10, 25, 11, 0),
      end: new Date(2024, 10, 25, 12, 0),
      type: "lease",
      description: "New tenant lease signing and key handover",
      location: "Main Office",
      contact: "Sarah Johnson (New Tenant)"
    }
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleDayClick = (date, dayEvents) => {
    setSelectedDay({
      date: date,
      events: dayEvents
    });
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const generateMonthView = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    daysOfWeek.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(event => 
        event.start.getDate() === day && 
        event.start.getMonth() === currentDate.getMonth()
      );

      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(date, dayEvents)}
        >
          <span className="day-number">{day}</span>
          <div className="day-events">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-pill ${event.type}`}
                onClick={(e) => handleEventClick(event, e)}
              >
                <span className="event-time">
                  {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const generateWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div className="week-view">
        <div className="timeline-header">
          <div className="time-gutter"></div>
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isToday = new Date().toDateString() === date.toDateString();
            
            return (
              <div key={`day-${i}`} className={`day-column ${isToday ? 'today' : ''}`}>
                <span className="day-name">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="date">{date.getDate()}</span>
              </div>
            );
          })}
        </div>
        
        <div className="week-grid">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={`hour-${hour}`} className="time-slot">
              <div className="time-label">{`${hour.toString().padStart(2, '0')}:00`}</div>
              <div className="hour-grid">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const date = new Date(startOfWeek);
                  date.setDate(startOfWeek.getDate() + dayIndex);
                  date.setHours(hour);
                  
                  const hourEvents = events.filter(event => 
                    event.start.getDate() === date.getDate() &&
                    event.start.getMonth() === date.getMonth() &&
                    event.start.getHours() === hour
                  );

                  return (
                    <div key={`slot-${dayIndex}-${hour}`} className="slot">
                      {hourEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`week-event ${event.type}`}
                          onClick={(e) => handleEventClick(event, e)}
                          style={{
                            height: `${((event.end - event.start) / (1000 * 60)) * (100 / 60)}%`
                          }}
                        >
                          <div className="event-time">
                            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="event-title">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const generateDayView = () => {
    return (
      <div className="day-view">
        <div className="day-header">
          <h3>{currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
        </div>
        <div className="day-timeline">
          {Array.from({ length: 24 }, (_, hour) => {
            const dayEvents = events.filter(event => 
              event.start.getDate() === currentDate.getDate() &&
              event.start.getMonth() === currentDate.getMonth() &&
              event.start.getHours() === hour
            );

            return (
              <div key={`hour-${hour}`} className="hour-slot">
                <div className="hour-label">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
                <div className="hour-content">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`day-event ${event.type}`}
                      onClick={(e) => handleEventClick(event, e)}
                      style={{
                        height: `${((event.end - event.start) / (1000 * 60)) * (100 / 60)}px`
                      }}
                    >
                      <div className="event-time">
                        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="event-title">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const generateTimelineView = () => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      return date;
    });

    return (
      <div className="timeline-view">
        <div className="timeline-scroll">
          {days.map(day => (
            <div key={day.toISOString()} className="timeline-day">
              <div className="timeline-day-header">
                {day.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="timeline-events">
                {events
                  .filter(event => 
                    event.start.getDate() === day.getDate() &&
                    event.start.getMonth() === day.getMonth()
                  )
                  .sort((a, b) => a.start - b.start)
                  .map(event => (
                    <div 
                      key={event.id}
                      className={`timeline-event ${event.type}`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <span className="event-time">
                        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="event-title">{event.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="calendar-page">        
          <SearchBar/>
          <div className="decorative-header">
            <div className="header-line">
              <div className="circle-ornament"></div>
            </div>
            <h1>CALENDAR</h1>
            <div className="header-line">
              <div className="circle-ornament"></div>
            </div>
          </div>
          <div className="calendar-controls">
            <div className="view-controls">
              <button
                className={`view-btn ${currentView === 'month' ? 'active' : ''}`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
              <button
                className={`view-btn ${currentView === 'week' ? 'active' : ''}`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button
                className={`view-btn ${currentView === 'day' ? 'active' : ''}`}
                onClick={() => setCurrentView('day')}
              >
                Day
              </button>
              <button
                className={`view-btn ${currentView === 'timeline' ? 'active' : ''}`}
                onClick={() => setCurrentView('timeline')}
              >
                Timeline
              </button>
            </div>

            <div className="navigation-controls">
              <button className="nav-btn" onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}>
                ←
              </button>
              <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <button className="nav-btn" onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}>
                →
              </button>
            </div>
          </div>

          <div className="calendar-container">
            {currentView === 'month' && (
              <div className="month-view">
                {generateMonthView()}
              </div>
            )}
            {currentView === 'week' && generateWeekView()}
            {currentView === 'day' && generateDayView()}
            {currentView === 'timeline' && generateTimelineView()}
          </div>

          {/* Event Details Modal */}
          {selectedEvent && (
            <div className="event-modal" onClick={() => setSelectedEvent(null)}>
              <div className="event-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={() => setSelectedEvent(null)}>×</button>
                <h3>{selectedEvent.title}</h3>
                <p className="event-time">
                  {selectedEvent.start.toLocaleString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    month: 'long',
                    day: 'numeric' 
                  })}
                  {' - '}
                  {selectedEvent.end.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="event-description">{selectedEvent.description}</p>
                <p className="event-location"><strong>Location:</strong> {selectedEvent.location}</p>
                <p className="event-contact"><strong>Contact:</strong> {selectedEvent.contact}</p>
                <div className={`event-type-badge ${selectedEvent.type}`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </div>
              </div>
            </div>
          )}

          {/* Day Events Modal */}
          {selectedDay && (
            <div className="day-modal" onClick={() => setSelectedDay(null)}>
              <div className="day-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={() => setSelectedDay(null)}>×</button>
                <h3>{selectedDay.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h3>
                <div className="day-events-list">
                  {selectedDay.events.length > 0 ? selectedDay.events.map(event => (
                    <div 
                      key={event.id} 
                      className={`day-event-item ${event.type}`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="event-time">
                        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="event-title">{event.title}</div>
                    </div>
                  )) : (
                    <p className="no-events">No events scheduled for this day</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;