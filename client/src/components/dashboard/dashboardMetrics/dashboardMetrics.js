import React, { useState } from "react";
import {
  DollarSign,
  Building2,
  AlertTriangle,
  ChartPie,
  TrendingUp,
  Users,
  Wallet,
  CalendarClock,
  Wrench,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Home,
  Receipt,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Sector,
} from "recharts";
import "./dashboardMetrics.css";

const DashboardMetrics = () => {
  const [activeExpenseIndex, setActiveExpenseIndex] = useState(null);

  const monthlyData = [
    { month: "Jun", revenue: 15000, expenses: 9000 },
    { month: "Jul", revenue: 17500, expenses: 10200 },
    { month: "Aug", revenue: 16800, expenses: 9800 },
    { month: "Sep", revenue: 18200, expenses: 10500 },
    { month: "Oct", revenue: 19500, expenses: 11200 },
    { month: "Nov", revenue: 18450, expenses: 10800 },
  ];

  const enhancedExpenseBreakdown = [
    {
      name: "Maintenance",
      value: 25,
      color: "#e17b50",
      breakdown: [
        { name: "Repairs", value: 12, amount: 2400 },
        { name: "Preventive", value: 8, amount: 1600 },
        { name: "Emergency", value: 5, amount: 1000 },
      ],
      trend: "+5.2%",
      amount: 5000,
    },
    {
      name: "Insurance",
      value: 15,
      color: "#8b5cf6",
      breakdown: [
        { name: "Property", value: 10, amount: 2000 },
        { name: "Liability", value: 5, amount: 1000 },
      ],
      trend: "-2.1%",
      amount: 3000,
    },
    {
      name: "Property Tax",
      value: 30,
      color: "#10b981",
      breakdown: [
        { name: "City Tax", value: 20, amount: 4000 },
        { name: "County Tax", value: 10, amount: 2000 },
      ],
      trend: "0%",
      amount: 6000,
    },
    {
      name: "Utilities",
      value: 20,
      color: "#3b82f6",
      breakdown: [
        { name: "Electric", value: 8, amount: 1600 },
        { name: "Water", value: 7, amount: 1400 },
        { name: "Gas", value: 5, amount: 1000 },
      ],
      trend: "+1.8%",
      amount: 4000,
    },
    {
      name: "Management",
      value: 10,
      color: "#f59e0b",
      breakdown: [
        { name: "Staff", value: 6, amount: 1200 },
        { name: "Software", value: 4, amount: 800 },
      ],
      trend: "+0.5%",
      amount: 2000,
    },
  ];

  const maintenanceData = [
    { status: "Completed", count: 28 },
    { status: "In Progress", count: 5 },
    { status: "Pending", count: 3 },
  ];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 4}
          outerRadius={outerRadius + 4}
          fill={fill}
          opacity={0.2}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='expense-tooltip'>
          <h6>{data.name}</h6>
          <p className='tooltip-value'>${data.amount.toLocaleString()}</p>
          <p className='tooltip-percentage'>{data.value}% of total</p>
          <p className='tooltip-trend'>Year over Year: {data.trend}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='dashboard-metrics'>
      {/* Top Metrics Row */}
      <div className='metrics-row'>
        <div className='metric-card'>
          <div className='metric-header'>
            <DollarSign className='metric-icon' />
            <div className='trend-indicator'>
              <ArrowUpRight className='trend-icon positive' />
              <span className='trend-positive'>+2.1%</span>
            </div>
          </div>
          <div className='metric-content'>
            <h3>$18,450</h3>
            <p>Monthly Revenue</p>
            <div className='metric-details'>
              <span>YTD: $198,450</span>
              <span>Target: $20,000</span>
            </div>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-header'>
            <Building2 className='metric-icon' />
            <div className='trend-indicator'>
              <span className='trend-neutral'>92%</span>
            </div>
          </div>
          <div className='metric-content'>
            <h3>10</h3>
            <p>Total Properties</p>
            <div className='metric-details'>
              <span>8 Residential</span>
              <span>2 Commercial</span>
            </div>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-header'>
            <Users className='metric-icon' />
            <div className='trend-indicator'>
              <span className='trend-positive'>98%</span>
            </div>
          </div>
          <div className='metric-content'>
            <h3>24</h3>
            <p>Active Tenants</p>
            <div className='metric-details'>
              <span>2 New this month</span>
              <span>1 Moving out</span>
            </div>
          </div>
        </div>

        <div className='metric-card'>
          <div className='metric-header'>
            <Receipt className='metric-icon' />
            <div className='trend-indicator'>
              <ArrowDownRight className='trend-icon negative' />
              <span className='trend-negative'>3 Late</span>
            </div>
          </div>
          <div className='metric-content'>
            <h3>21</h3>
            <p>Paid Rents</p>
            <div className='metric-details'>
              <span>$5,200 Outstanding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className='charts-row'>
        {/* Revenue Trend */}
        <div className='chart-card'>
          <div className='chart-header'>
            <div>
              <h4>Revenue vs Expenses</h4>
              <span className='subtitle'>Last 6 months</span>
            </div>
            <TrendingUp className='chart-icon' />
          </div>
          <div className='chart-content'>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={monthlyData}>
                <XAxis dataKey='month' axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  stroke='#10b981'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='expenses'
                  stroke='#ef4444'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='sub-metrics'>
            <div className='sub-metric-card'>
              <Wallet className='sub-metric-icon' />
              <div>
                <h5>Net Income</h5>
                <span>$7,650</span>
              </div>
            </div>
            <div className='sub-metric-card'>
              <TrendingUp className='sub-metric-icon' />
              <div>
                <h5>YoY Growth</h5>
                <span>+15.2%</span>
              </div>
            </div>
            <div className='sub-metric-card'>
              <Building className='sub-metric-icon' />
              <div>
                <h5>Avg. per Property</h5>
                <span>$1,845</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Expense Breakdown */}
        <div className='chart-card expense-card'>
          <div className='chart-header'>
            <div>
              <h4>Expense Breakdown</h4>
              <span className='subtitle'>Current month • Total: $20,000</span>
            </div>
            <ChartPie className='chart-icon' />
          </div>
          <div className='expense-content'>
            <div className='expense-chart'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={enhancedExpenseBreakdown}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={90}
                    activeIndex={activeExpenseIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveExpenseIndex(index)}
                    onMouseLeave={() => setActiveExpenseIndex(null)}
                  >
                    {enhancedExpenseBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className='expense-cell'
                      />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='expense-details'>
              {enhancedExpenseBreakdown.map((category, index) => (
                <div
                  key={index}
                  className={`expense-category ${
                    activeExpenseIndex === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveExpenseIndex(index)}
                  onMouseLeave={() => setActiveExpenseIndex(null)}
                >
                  <div className='category-header'>
                    <div className='category-title'>
                      <span
                        className='category-dot'
                        style={{ backgroundColor: category.color }}
                      />
                      <h6>{category.name}</h6>
                    </div>
                    <div className='category-metrics'>
                      <span className='category-amount'>
                        ${category.amount.toLocaleString()}
                      </span>
                      <span className='category-percentage'>
                        {category.value}%
                      </span>
                    </div>
                  </div>
                  <div className='category-breakdown'>
                    {category.breakdown.map((item, itemIndex) => (
                      <div key={itemIndex} className='breakdown-item'>
                        <div className='breakdown-label'>
                          <span>{item.name}</span>
                        </div>
                        <div className='breakdown-values'>
                          <span>${item.amount.toLocaleString()}</span>
                          <span className='breakdown-percentage'>
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Management Row */}
      <div className='management-row'>
        {/* Maintenance Metrics */}
        <div className='management-card'>
          <div className='management-header'>
            <div>
              <h4>Maintenance Overview</h4>
              <span className='subtitle'>Current month statistics</span>
            </div>
            <Wrench className='management-icon' />
          </div>
          <div className='management-content'>
            <ResponsiveContainer width='100%' height={120}>
              <BarChart data={maintenanceData}>
                <XAxis dataKey='status' axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey='count' fill='#8b5cf6' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className='management-card'>
          <div className='management-header'>
            <div>
              <h4>Upcoming Renewals</h4>
              <span className='subtitle'>Next 30 days</span>
            </div>
            <CalendarClock className='management-icon' />
          </div>
          <div className='renewal-list'>
            <div className='renewal-item'>
              <Home className='renewal-icon' />
              <div className='renewal-details'>
                <h5>123 Main St, Apt 4B</h5>
                <p>Due in 7 days • Current rent: $1,500</p>
              </div>
            </div>
            <div className='renewal-item'>
              <Building className='renewal-icon' />
              <div className='renewal-details'>
                <h5>456 Commerce Ave, Suite 201</h5>
                <p>Due in 14 days • Current rent: $2,800</p>
              </div>
            </div>
            <div className='renewal-item'>
              <Home className='renewal-icon' />
              <div className='renewal-details'>
                <h5>789 Park Rd, Unit 2A</h5>
                <p>Due in 21 days • Current rent: $1,800</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Summary */}
        <div className='management-card'>
          <div className='management-header'>
            <div>
              <h4>Task Summary</h4>
              <span className='subtitle'>Today's overview</span>
            </div>
            <CheckCircle className='management-icon' />
          </div>
          <div className='task-list'>
            <div className='task-item urgent'>
              <Clock className='task-icon' />
              <div className='task-details'>
                <h5>Urgent Inspection</h5>
                <p>Unit 4B - Water leak reported</p>
              </div>
            </div>
            <div className='task-item'>
              <Users className='task-icon' />
              <div className='task-details'>
                <h5>Tenant Meeting</h5>
                <p>2:00 PM - New lease signing</p>
              </div>
            </div>
            <div className='task-item'>
              <Wrench className='task-icon' />
              <div className='task-details'>
                <h5>Maintenance Follow-up</h5>
                <p>HVAC repair completion check</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
