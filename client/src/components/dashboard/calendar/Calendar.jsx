// Calendar.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../sidebar/Sidebar';
import DayPanel from './DayPanel';
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

  // Modern AI/Art Deco color palette
  const eventTypes = {
    meeting: { 
      color: 'bg-gradient-to-r from-violet-600 to-purple-700',
      hover: 'hover:from-violet-700 hover:to-purple-800'
    },
    deadline: { 
      color: 'bg-gradient-to-r from-rose-500 to-pink-600',
      hover: 'hover:from-rose-600 hover:to-pink-700'
    },
    social: { 
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      hover: 'hover:from-emerald-600 hover:to-teal-700'
    },
    reminder: { 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      hover: 'hover:from-blue-600 hover:to-indigo-700'
    }
  };

  const sampleEvents = [
    { id: 1, title: 'Property Inspection', type: 'meeting', time: '9:00 AM', duration: '1h' },
    { id: 2, title: 'Lease Renewal', type: 'deadline', time: '2:00 PM', duration: '30m' },
    { id: 3, title: 'Tenant Meeting', type: 'social', time: '12:00 PM', duration: '1h' },
    { id: 4, title: 'Maintenance Check', type: 'reminder', time: '4:00 PM', duration: '1h' }
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
        <SheetContent className="w-96 bg-gradient-to-br from-white to-violet-50">
          <SheetHeader>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <SheetTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                {formattedDate}
              </SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDayDetailsOpen(false)}
                className="hover:bg-violet-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </SheetHeader>
          
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">SCHEDULE</h3>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {selectedDay.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                      <div className={`w-2 h-2 rounded-full ${eventTypes[event.type].color} mb-2`} />
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {event.time} · {event.duration}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
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
      <motion.div 
        className="grid grid-cols-7 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
          >
            <Card
              className={`min-h-28 p-2 border-0 ${
                day.empty ? 'bg-gray-50/30' : 
                'hover:shadow-lg hover:shadow-violet-100 transition-all cursor-pointer bg-white/80 backdrop-blur-sm'
              }`}
              onClick={() => handleDayClick(day)}
            >
              {!day.empty && (
                <>
                  <div className={`text-sm font-medium ${
                    new Date().getDate() === day.day &&
                    new Date().getMonth() === currentDate.getMonth()
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg'
                      : ''
                  }`}>
                    {day.day}
                  </div>
                  <div className="mt-1 space-y-1">
                    <AnimatePresence>
                      {day.events?.map((event, eventIndex) => (
                        <motion.div
                          key={eventIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`p-1.5 text-xs rounded-md ${eventTypes[event.type].color} 
                            ${eventTypes[event.type].hover} text-white shadow-md transition-all duration-300`}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs opacity-90">{event.time}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (    
    <div className="calendar flex h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50">
      <div className="w-64 border-r border-violet-100 backdrop-blur-sm">
        <Sidebar />
      </div>
      <DayPanel />
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-violet-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="hover:bg-violet-50 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-violet-600" />
            </Button>
            <motion.h2 
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600"
              key={currentDate.getMonth()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </motion.h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-violet-50 transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-violet-600" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {['month', 'week', 'day', 'timeline'].map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? 'default' : 'outline'}
                onClick={() => setView(viewType)}
                className={`capitalize transition-all duration-300 ${
                  view === viewType 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white' 
                    : 'hover:bg-violet-50'
                }`}
              >
                {viewType}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-violet-50 transition-colors duration-200">
              <Search className="h-5 w-5 text-violet-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-violet-50 transition-colors duration-200">
              <Bell className="h-5 w-5 text-violet-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-violet-50 transition-colors duration-200">
              <Users className="h-5 w-5 text-violet-600" />
            </Button>
            <motion.div 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium text-white">JD</span>
            </motion.div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-white/50 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'day' && renderDayView()}
              {view === 'week' && renderWeekView()}
              {view === 'month' && renderMonthView()}
              {view === 'timeline' && renderTimelineView()}
              {renderDayDetails()}
            </motion.div>
          </AnimatePresence>
          {renderDayDetails()}
        </main>
      </motion.div>
    </div>
  );
};

export default Calendar;