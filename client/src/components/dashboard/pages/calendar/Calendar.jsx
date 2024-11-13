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
    // Week 1
    {
      id: 1,
      title: "Property Inspection - Nob Hill Complex",
      start: new Date(2024, 10, 1, 9, 0),
      end: new Date(2024, 10, 1, 10, 30),
      location: "1200 California St, San Francisco",
      type: "primary",
      attendees: ["JM", "KL", "RT"],
    },
    {
      id: 2,
      title: "Tenant Lease Signing - SOMA Unit",
      start: new Date(2024, 10, 1, 14, 0),
      end: new Date(2024, 10, 1, 15, 15),
      location: "888 Brannan St, San Francisco",
      type: "success",
      attendees: ["JM", "CW"],
    },
    {
      id: 3,
      title: "Building Maintenance Review",
      start: new Date(2024, 10, 4, 10, 0),
      end: new Date(2024, 10, 4, 11, 30),
      location: "Marina District Property",
      type: "warning",
      attendees: ["JM", "MT", "RS"],
    },

    // Week 2
    {
      id: 4,
      title: "Quarterly Budget Meeting",
      start: new Date(2024, 10, 7, 13, 0),
      end: new Date(2024, 10, 7, 14, 30),
      location: "Virtual Meeting",
      type: "dark",
      attendees: ["JM", "FD", "AC", "BL"],
    },
    {
      id: 5,
      title: "Property Tax Assessment",
      start: new Date(2024, 10, 8, 11, 0),
      end: new Date(2024, 10, 8, 12, 0),
      location: "City Hall, San Francisco",
      type: "warning",
      attendees: ["JM", "TX"],
    },
    {
      id: 6,
      title: "New Property Viewing",
      start: new Date(2024, 10, 8, 15, 0),
      end: new Date(2024, 10, 8, 16, 30),
      location: "Pacific Heights",
      type: "primary",
      attendees: ["JM", "BC"],
    },

    // Week 3
    {
      id: 7,
      title: "Contractor Meeting - Renovation",
      start: new Date(2024, 10, 12, 9, 0),
      end: new Date(2024, 10, 12, 10, 30),
      location: "Hayes Valley Project",
      type: "dark",
      attendees: ["JM", "CT", "PM"],
    },
    {
      id: 8,
      title: "Tenant Association Meeting",
      start: new Date(2024, 10, 14, 18, 0),
      end: new Date(2024, 10, 14, 19, 30),
      location: "Community Room - Mission District",
      type: "success",
      attendees: ["JM", "TA", "RB"],
    },
    {
      id: 9,
      title: "Insurance Policy Review",
      start: new Date(2024, 10, 15, 10, 0),
      end: new Date(2024, 10, 15, 11, 0),
      location: "Virtual Meeting",
      type: "warning",
      attendees: ["JM", "IN"],
    },

    // Week 4
    {
      id: 10,
      title: "Emergency System Testing",
      start: new Date(2024, 10, 19, 8, 0),
      end: new Date(2024, 10, 19, 10, 0),
      location: "Multiple Properties",
      type: "warning",
      attendees: ["JM", "ST", "FD"],
    },
    {
      id: 11,
      title: "Lease Renewal Meeting",
      start: new Date(2024, 10, 20, 14, 0),
      end: new Date(2024, 10, 20, 15, 0),
      location: "Richmond District Property",
      type: "success",
      attendees: ["JM", "TN"],
    },
    {
      id: 12,
      title: "Staff Training Session",
      start: new Date(2024, 10, 21, 9, 0),
      end: new Date(2024, 10, 21, 12, 0),
      location: "Training Center",
      type: "primary",
      attendees: ["JM", "ST", "TR", "HR"],
    },

    // Week 5
    {
      id: 13,
      title: "End of Month Inspection",
      start: new Date(2024, 10, 25, 13, 0),
      end: new Date(2024, 10, 25, 16, 0),
      location: "All Properties",
      type: "dark",
      attendees: ["JM", "IN", "PM"],
    },
    {
      id: 14,
      title: "Holiday Decoration Planning",
      start: new Date(2024, 10, 27, 11, 0),
      end: new Date(2024, 10, 27, 12, 30),
      location: "Main Office",
      type: "success",
      attendees: ["JM", "DC", "MT"],
    },
    {
      id: 15,
      title: "Year-End Budget Review",
      start: new Date(2024, 10, 29, 14, 0),
      end: new Date(2024, 10, 29, 16, 0),
      location: "Conference Room",
      type: "primary",
      attendees: ["JM", "FD", "AC", "CEO"],
    },

    {
      id: 15,
      title: "Lease Renewal for Thomas Qu",
      start: new Date(2024, 10, 30, 7, 0),
      end: new Date(2024, 10, 30, 16, 0),
      type: "primary",
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
