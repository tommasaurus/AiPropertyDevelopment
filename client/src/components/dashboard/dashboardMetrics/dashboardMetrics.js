import React from "react";
import {
  Bell,
  Calendar,
  Upload,
  DollarSign,
  Users,
  Percent,
} from "lucide-react";
import "./dashboardMetrics.css";

const DashboardMetrics = () => {
  const metrics = [
    {
      title: "Alerts",
      value: "3",
      icon: Bell,
      color: "bg-red",
      iconColor: "icon-red",
      subtitle: "New notifications",
    },
    {
      title: "Calendar",
      value: "5",
      icon: Calendar,
      color: "bg-blue",
      iconColor: "icon-blue",
      subtitle: "Upcoming events",
    },
    {
      title: "Documents",
      value: "12",
      icon: Upload,
      color: "bg-purple",
      iconColor: "icon-purple",
      subtitle: "Files uploaded",
    },
    {
      title: "Incoming Rent",
      value: "$24,680.00",
      icon: DollarSign,
      color: "bg-green",
      iconColor: "icon-green",
      subtitle: "August 2024",
    },
    {
      title: "Active Tenants",
      value: "32",
      icon: Users,
      color: "bg-yellow",
      iconColor: "icon-yellow",
      subtitle: "Across properties",
    },
    {
      title: "Occupancy Rate",
      value: "92.00%",
      icon: Percent,
      color: "bg-orange",
      iconColor: "icon-orange",
      subtitle: "Property utilization",
    },
  ];

  return (
    <div className='dashboard-metrics'>
      {/* Metrics Grid */}
      <div className='metrics-grid'>
        {metrics.map((metric, index) => (
          <div key={index} className='metric-card'>
            <div className='metric-content'>
              <div className='metric-header'>
                <div className={`metric-icon-wrapper ${metric.color}`}>
                  <metric.icon className={`metric-icon ${metric.iconColor}`} />
                </div>
                <span className='metric-subtitle'>{metric.subtitle}</span>
              </div>
              <div className='metric-details'>
                <h3 className='metric-value'>{metric.value}</h3>
                <p className='metric-title'>{metric.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMetrics;
