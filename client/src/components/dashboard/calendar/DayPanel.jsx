import React from 'react';
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Plus, Bell, Calendar as CalendarIcon, Clock } from 'lucide-react';

const DayPanel = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const notifications = [
    { id: 1, title: 'Lease Renewal Due', time: '2 hours ago', type: 'warning' },
    { id: 2, title: 'New Maintenance Request', time: '4 hours ago', type: 'info' },
    { id: 3, title: 'Rent Payment Received', time: '5 hours ago', type: 'success' }
  ];

  const todayTasks = [
    { id: 1, title: 'Property Inspection', time: '9:00 AM', completed: false },
    { id: 2, title: 'Meet with Tenant', time: '2:00 PM', completed: true },
    { id: 3, title: 'Review Applications', time: '4:00 PM', completed: false }
  ];

  return (
    <div className="w-80 border-r border-violet-100 p-6 bg-white/80 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
          {formattedDate}
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button
            variant="outline"
            className="w-full border-violet-200 hover:bg-violet-50"
          >
            <Bell className="w-4 h-4 mr-2" />
            Reminders
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Today's Tasks</h3>
          <Button variant="ghost" size="sm" className="text-violet-600 hover:bg-violet-50">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {todayTasks.map(task => (
            <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                />
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {task.time}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-violet-600 hover:bg-violet-50">
            Clear All
          </Button>
        </div>
        <div className="space-y-3">
          {notifications.map(notification => (
            <Card key={notification.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${
                  notification.type === 'warning' ? 'bg-amber-500' :
                  notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayPanel;