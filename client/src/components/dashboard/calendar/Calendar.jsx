// Calendar.jsx

import React, { useState } from 'react';
// import './Calendar.css'
import Sidebar from '../sidebar/Sidebar';
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Users,
  Plus,
  X
} from 'lucide-react';

const Calendar = () => {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);

  // Event types with their colors
  const eventTypes = {
    meeting: { color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    deadline: { color: 'bg-red-500', hover: 'hover:bg-red-600' },
    social: { color: 'bg-green-500', hover: 'hover:bg-green-600' },
    reminder: { color: 'bg-blue-500', hover: 'hover:bg-blue-600' }
  };

  const sampleEvents = [
    { id: 1, title: 'Team Meeting', type: 'meeting', time: '9:00 AM', duration: '1h' },
    { id: 2, title: 'Project Deadline', type: 'deadline', time: '2:00 PM', duration: '30m' },
    { id: 3, title: 'Team Lunch', type: 'social', time: '12:00 PM', duration: '1h' },
    { id: 4, title: 'Code Review', type: 'reminder', time: '4:00 PM', duration: '1h' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', empty: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        events: i % 3 === 0 ? [
          sampleEvents[i % sampleEvents.length]
        ] : []
      });
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleDayClick = (day) => {
    if (!day.empty) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day);
      setSelectedDay({ ...day, date: selectedDate });
      setIsDayDetailsOpen(true);
    }
  };

  const renderDayDetails = () => {
    if (!selectedDay) return null;

    const formattedDate = selectedDay.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <Sheet open={isDayDetailsOpen} onOpenChange={setIsDayDetailsOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">{formattedDate}</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDayDetailsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">SCHEDULE</h3>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </div>

            <div className="space-y-4">
              {selectedDay.events.map((event, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-all">
                  <div className={`w-2 h-2 rounded-full ${eventTypes[event.type].color} mb-2`} />
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {event.time} · {event.duration}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  const renderTimelineView = () => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date,
        events: i === 0 ? [{
          title: 'Team Meeting',
          time: '9:00 AM',
          type: 'meeting'
        }] : []
      });
    }

    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {days.map((day, index) => (
          <Card key={index} className="flex-shrink-0 w-80 p-4 hover:shadow-lg transition-shadow">
            <div className="font-medium text-lg">
              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="space-y-3">
              {day.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`p-3 rounded-lg ${eventTypes[event.type].color} ${eventTypes[event.type].hover} 
                    text-white transition-all cursor-pointer`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm opacity-90">{event.time}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <div className="flex flex-col space-y-4">
        <div className="text-xl font-bold mb-4">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        {hours.map((hour) => (
          <Card key={hour} className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="w-24 text-gray-500">
                {`${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
              </div>
              <div className="flex-1 ml-4">
                {hour === 9 && (
                  <div className={`p-2 rounded-lg ${eventTypes.meeting.color} text-white`}>
                    <div className="font-medium">Team Meeting</div>
                    <div className="text-sm">9:00 AM - 10:00 AM</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        date,
        events: i % 2 === 0 ? [sampleEvents[i % sampleEvents.length]] : []
      });
    }

    return (
      <div className="grid grid-cols-7 gap-4 h-screen-3/4">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col h-full">
            <div className="text-sm font-medium text-gray-500 mb-2">
              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              <div className="text-lg font-bold text-gray-900">
                {day.date.getDate()}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {day.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`p-2 rounded-lg ${eventTypes[event.type].color} ${eventTypes[event.type].hover} 
                    text-white transition-colors duration-200 cursor-pointer`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm opacity-90">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <Card
            key={index}
            className={`min-h-28 p-2 ${
              day.empty ? 'bg-gray-50/50' : 'hover:shadow-md transition-all cursor-pointer'
            }`}
            onClick={() => handleDayClick(day)}
          >
            {!day.empty && (
              <>
                <div className={`text-sm font-medium ${
                  new Date().getDate() === day.day &&
                  new Date().getMonth() === currentDate.getMonth()
                    ? 'text-purple-600 bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center'
                    : ''
                }`}>
                  {day.day}
                </div>
                {day.events?.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`mt-1 p-1.5 text-xs rounded-lg ${eventTypes[event.type].color} 
                      ${eventTypes[event.type].hover} text-white transition-all`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs opacity-90">{event.time}</div>
                  </div>
                ))}
              </>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar flex h-screen bg-gray-50">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-6 bg-white border-b">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
              className={view === 'month' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
              className={view === 'week' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              onClick={() => setView('day')}
              className={view === 'day' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              Day
            </Button>
            <Button
              variant={view === 'timeline' ? 'default' : 'outline'}
              onClick={() => setView('timeline')}
              className={view === 'timeline' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              Timeline
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-600">JD</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
            {view === 'timeline' && renderTimelineView()}
            {renderDayDetails()}
        </main>
      </div>
    </div>
  );
};

export default Calendar;