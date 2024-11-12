// dashboardMetrics.jsx
import React from "react";
import {
  Bell,
  Calendar,
  Upload,
  DollarSign,
  Users,
  Percent,
  Building2,
  ArrowUpRight,
  LineChart,
  Minus,
} from "lucide-react";
import "./dashboardMetrics.css";

const DashboardMetrics = () => {
  const metrics = [
    {
      title: "Incoming Rent",
      value: "$24.6k",
      icon: DollarSign,
      subtitle: "Aug '24",
      trend: "+2.1%",
      color: "emerald",
    },
    {
      title: "Occupancy",
      value: "92%",
      icon: Percent,
      subtitle: "Utilization",
      trend: "+5%",
      color: "blue",
    },
    {
      title: "Tenants",
      value: "32",
      icon: Users,
      subtitle: "Active",
      trend: "+2",
      color: "purple",
    },
    {
      title: "Documents",
      value: "12",
      icon: Upload,
      subtitle: "Uploaded",
      trend: "3 pending",
      color: "amber",
    },
    {
      title: "Alerts",
      value: "3",
      icon: Bell,
      subtitle: "New",
      trend: "1 urgent",
      color: "rose",
    },
    {
      title: "Events",
      value: "5",
      icon: Calendar,
      subtitle: "Upcoming",
      trend: "Next: Maint.",
      color: "indigo",
    },
  ];

  const percentageCharts = [
    {
      label: "Occupancy Rate",
      value: 61,
      color: "#3b82f6",
      description: "Current occupancy",
    },
    {
      label: "Return Rate",
      value: 38,
      color: "#10b981",
      description: "Annual ROI",
    },
    {
      label: "Growth Rate",
      value: 72,
      color: "#8b5cf6",
      description: "Year over year",
    },
  ];

  const payments = [
    {
      tenant: "Sarah Johnson",
      property: "123 Palm Ave",
      amount: 2400,
      date: "Nov 10",
      status: "Completed",
      color: "emerald",
    },
    {
      tenant: "Mike Chen",
      property: "456 Oak St",
      amount: 1850,
      date: "Nov 9",
      status: "Processing",
      color: "blue",
    },
    {
      tenant: "Emma Davis",
      property: "789 Pine Rd",
      amount: 2100,
      date: "Nov 8",
      status: "Completed",
      color: "purple",
    },
    {
      tenant: "Alex Thompson",
      property: "321 Maple Dr",
      amount: 1950,
      date: "Nov 7",
      status: "Completed",
      color: "amber",
    },
  ];

  const MetricsHeader = () => (
    <div className='metrics-container'>
      {metrics.map((metric, index) => (
        <div key={index} className={`metric-item ${metric.color}`}>
          <div className='metric-icon-wrapper'>
            <metric.icon className='icon' size={20} strokeWidth={2} />
          </div>
          <div className='metric-content'>
            <div className='metric-header'>
              <span className='metric-value'>{metric.value}</span>
              <span className='metric-trend'>{metric.trend}</span>
            </div>
            <div className='metric-footer'>
              <span className='metric-title'>{metric.title}</span>
              <span className='metric-subtitle'>• {metric.subtitle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const PortfolioSection = () => (
    <div className='portfolio-value'>
      <div className='section-header'>
        <h3>Portfolio Value</h3>
        <span className='trend-positive'>+2.4% from last month</span>
      </div>

      <div className='metrics-row'>
        <div className='metric-block'>
          <span className='metric-label'>Properties</span>
          <div className='metric-value'>
            <Building2 size={20} className='metric-icon blue' />
            <span>32</span>
          </div>
        </div>
        <div className='metric-block'>
          <span className='metric-label'>Total Value</span>
          <div className='metric-value'>
            <DollarSign size={20} className='metric-icon emerald' />
            <span>8.45M</span>
          </div>
        </div>
        <div className='metric-block'>
          <span className='metric-label'>Appreciation</span>
          <div className='metric-value'>
            <LineChart size={20} className='metric-icon purple' />
            <span>+12.3%</span>
          </div>
        </div>
      </div>

      <div className='percentage-charts'>
        {percentageCharts.map((chart, index) => (
          <div key={index} className='chart-wrapper'>
            <div className='donut-chart'>
              <div
                className='donut-fill'
                style={{
                  "--percentage": chart.value,
                  "--chart-color": chart.color,
                }}
              >
                <span>{chart.value}%</span>
              </div>
              <div className='chart-label'>
                <div className='chart-title'>{chart.label}</div>
                <div className='chart-description'>{chart.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentSection = () => (
    <div className='recent-payments'>
      <div className='section-header'>
        <h3>Recent Payments</h3>
        <button className='view-all'>View All</button>
      </div>

      <div className='payments-list'>
        {payments.map((payment, index) => (
          <div key={index} className='payment-item'>
            <div className='payment-info'>
              <div className='tenant-name'>{payment.tenant}</div>
              <div className='property-address'>{payment.property}</div>
            </div>
            <div className='payment-connector'>
              <div className='connector-line'></div>
              <Minus className={`status-line ${payment.color}`} size={24} />
            </div>
            <div className='payment-details'>
              <div className={`payment-amount ${payment.color}`}>
                ${payment.amount.toLocaleString()}
              </div>
              <div className='payment-date'>{payment.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='dashboard-metrics'>
      <MetricsHeader />
      <div className='portfolio-container'>
        <PortfolioSection />
        <PaymentSection />
      </div>
    </div>
  );
};

export default DashboardMetrics;
