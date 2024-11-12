import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../sidebar/Sidebar";
import DayView from "./DayView";
import WeekView from "./WeekView";
import Chat from "../../chatBot/Chat";
import TopNavigation from "../../TopNavigation/TopNavigation";

const Calendar = () => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const mainContent = document.querySelector(".calendar-main");
    const handleSidebarChange = () => {
      if (document.body.classList.contains("dashboard-sidebar-expanded")) {
        mainContent?.classList.add("sidebar-expanded");
      } else {
        mainContent?.classList.remove("sidebar-expanded");
      }
    };

    handleSidebarChange();

    const observer = new MutationObserver(handleSidebarChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const events = [
    {
      id: 1,
      title: "Property Inspection - Nob Hill Complex",
      start: new Date(2024, 10, 12, 9, 0),
      end: new Date(2024, 10, 12, 10, 30),
      location: "1200 California St, San Francisco",
      type: "primary",
      attendees: ["JM", "KL", "RT"],
    },
    {
      id: 2,
      title: "Tenant Lease Signing - SOMA Unit",
      start: new Date(2024, 10, 12, 11, 0),
      end: new Date(2024, 10, 12, 12, 15),
      location: "888 Brannan St, San Francisco",
      type: "success",
      attendees: ["JM", "CW"],
    },
    {
      id: 3,
      title: "Contractor Meeting - Renovation Project",
      start: new Date(2024, 10, 12, 13, 30),
      end: new Date(2024, 10, 12, 15, 0),
      location: "Marina District Property, San Francisco",
      type: "dark",
      attendees: ["JM", "BK", "DH", "MS"],
    },
    {
      id: 4,
      title: "Building Safety Inspection",
      start: new Date(2024, 10, 12, 15, 30),
      end: new Date(2024, 10, 12, 17, 0),
      location: "Pacific Heights Complex, San Francisco",
      type: "warning",
      attendees: ["JM", "SF"],
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
    return date.toLocaleString("default", { month: "long" });
  };

  const formatEventTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (year, month, day) => {
    const newDate = new Date(year, month, day);
    setCurrentDate(newDate);
    setCurrentView("day");
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setCurrentDate(event.start);
    setSelectedEvent(event);
    setCurrentView("day");
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentView("day");
  };

  const renderCalendarDays = () => {
    const totalDays = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = currentDate.getMonth() - 1;
      const year = currentDate.getFullYear();

      days.push(
        <div
          key={`prev-${i}`}
          className='calendar-day other-month'
          onClick={() => handleDayClick(year, month, day)}
        >
          <div className='day-number'>{day}</div>
          <div className='events-container'></div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isToday = currentDay.toDateString() === new Date().toDateString();
      const dayEvents = events
        .filter(
          (event) => event.start.toDateString() === currentDay.toDateString()
        )
        .sort((a, b) => a.start - b.start);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""}`}
          onClick={() =>
            handleDayClick(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            )
          }
        >
          <div className='day-number'>{day}</div>
          <div className='events-container'>
            {dayEvents.map((event, index) => (
              <div
                key={event.id}
                className={`event-item ${event.type}`}
                title={`${formatEventTime(event.start)} - ${formatEventTime(
                  event.end
                )}\n${event.title}`}
                onClick={(e) => handleEventClick(event, e)}
              >
                <div className='event-time'>
                  {formatEventTime(event.start)} - {formatEventTime(event.end)}
                </div>
                <div className='event-title'>{event.title}</div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div
                className='more-events'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDayClick(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  );
                }}
              >
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month days
    const remainingCells = 35 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      days.push(
        <div
          key={`next-${i}`}
          className='calendar-day other-month'
          onClick={() => handleDayClick(year, month, i)}
        >
          <div className='day-number'>{i}</div>
          <div className='events-container'></div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className='calendar-layout'>
      <Sidebar />
      <TopNavigation />
      <Chat />

      <main className='calendar-main'>
        <div className='calendar-content'>
          <div className='calendar-header'>
            <div className='header-center'>
              <div className='calendar-type'>
                <button className='nav-button' onClick={handlePrevMonth}>
                  <ChevronLeft className='nav-icon' />
                </button>
                <span className='current-month'>
                  {formatMonth(currentDate)}, {currentDate.getFullYear()}
                </span>
                <button className='nav-button' onClick={handleNextMonth}>
                  <ChevronRight className='nav-icon' />
                </button>
              </div>
            </div>
            <div className='header-left'>
              <div className='view-options-container'>
                <div className='view-options-wrapper'>
                  {["Day", "Week", "Month"].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCurrentView(view.toLowerCase())}
                      className={`view-option ${
                        currentView === view.toLowerCase() ? "active" : ""
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className='header-right'>
              <button className='today-button' onClick={handleTodayClick}>
                Today ({getTodayDate()})
              </button>
              <button className='new-schedule-button'>+ New Schedule</button>
            </div>
          </div>

          {currentView === "day" ? (
            <DayView
              currentDate={currentDate}
              events={events}
              onDateChange={(date) => setCurrentDate(date)}
              onEventClick={handleEventClick}
              selectedEvent={selectedEvent}
            />
          ) : currentView === "week" ? (
            <WeekView
              currentDate={currentDate}
              events={events}
              onDateChange={(date) => setCurrentDate(date)}
              onEventClick={handleEventClick}
            />
          ) : (
            <>
              <div className='calendar-days'>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <span key={day} className='day-label'>
                    {day}
                  </span>
                ))}
              </div>
              <div className='calendar-grid'>{renderCalendarDays()}</div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;
