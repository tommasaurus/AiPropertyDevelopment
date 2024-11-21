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

const DashboardMetrics = ({
  properties = [],
  tenants = [],
  incomes = [],
  expenses = [],
}) => {
  const [activeExpenseIndex, setActiveExpenseIndex] = useState(null);

  // Calculate metrics
  const totalProperties = properties.length;
  const activeTenantsCount = tenants.length;
  const paidRentsCount = incomes.length;

  // Calculate residential vs commercial properties
  const residentialCount = properties.filter((p) => !p.is_commercial).length;
  const commercialCount = properties.filter((p) => p.is_commercial).length;

  // Calculate monthly revenue (sum of all incomes for current month)
  const calculateMonthlyRevenue = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyIncome = incomes
      .filter((income) => {
        const incomeDate = new Date(income.transaction_date);
        return (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      })
      .reduce((total, income) => total + (income.amount || 0), 0);

    return monthlyIncome;
  };

  // Calculate YTD revenue
  const calculateYTDRevenue = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const ytdIncome = incomes
      .filter((income) => {
        const incomeDate = new Date(income.transaction_date);
        return incomeDate.getFullYear() === currentYear;
      })
      .reduce((total, income) => total + (income.amount || 0), 0);

    return ytdIncome;
  };

  // Get revenue metrics with defaults
  const monthlyRevenue = calculateMonthlyRevenue();
  const ytdRevenue = calculateYTDRevenue();

  // Calculate revenue growth percentage
  const calculateRevenueGrowth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Current month revenue
    const currentMonthRevenue = incomes
      .filter((income) => {
        const incomeDate = new Date(income.transaction_date);
        return (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      })
      .reduce((total, income) => total + (income.amount || 0), 0);

    // Previous month revenue
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthRevenue = incomes
      .filter((income) => {
        const incomeDate = new Date(income.transaction_date);
        return (
          incomeDate.getMonth() === previousMonth &&
          incomeDate.getFullYear() === previousYear
        );
      })
      .reduce((total, income) => total + (income.amount || 0), 0);

    if (previousMonthRevenue === 0) return 0;
    return (
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100
    ).toFixed(1);
  };

  const revenueGrowth = calculateRevenueGrowth();

  // Calculate monthly expense (sum of all expenses for current month)
  const calculateMonthlyExpense = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpense = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.transaction_date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => total + (expense.amount || 0), 0);

    return monthlyExpense;
  };

  const monthlyExpense = calculateMonthlyExpense();

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
        <div className="expense-tooltip">
          <h6>{data.name}</h6>
          <p className="tooltip-value">${data.amount.toLocaleString()}</p>
          <p className="tooltip-percentage">{data.value}% of total</p>
          <p className="tooltip-trend">Year over Year: {data.trend}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-metrics">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <DollarSign className="metric-icon" />
            <div className="trend-indicator">
              <ArrowUpRight className="trend-icon positive" />
              <span
                className={`trend-${
                  revenueGrowth >= 0 ? "positive" : "negative"
                }`}
              >
                {revenueGrowth > 0 ? "+" : ""}
                {revenueGrowth}%
              </span>
            </div>
          </div>
          <div className="metric-content">
            <h3>{monthlyRevenue.toLocaleString()}</h3>
            <p>Monthly Revenue</p>
            <div className="metric-details">
              <span>YTD: ${ytdRevenue.toLocaleString()}</span>
              <span>Target: $0</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Building2 className="metric-icon" />
            <div className="trend-indicator">
              <span className="trend-neutral">100%</span>
            </div>
          </div>
          <div className="metric-content">
            <h3>{totalProperties}</h3>
            <p>Total Properties</p>
            <div className="metric-details">
              <span>{residentialCount} Residential</span>
              <span>{commercialCount} Commercial</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Users className="metric-icon" />
            <div className="trend-indicator">
              <span className="trend-positive">100%</span>
            </div>
          </div>
          <div className="metric-content">
            <h3>{activeTenantsCount}</h3>
            <p>Active Tenants</p>
            <div className="metric-details">
              <span>{activeTenantsCount} New this month</span>
              <span>0 Moving out</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Receipt className="metric-icon" />
            <div className="trend-indicator">
              <ArrowDownRight className="trend-icon negative" />
              <span className="trend-negative">0 Late</span>
            </div>
          </div>
          <div className="metric-content">
            <h3>{paidRentsCount}</h3>
            <p>Paid Rents</p>
            <div className="metric-details">
              <span>$0 Outstanding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h4>Revenue vs Expenses</h4>
              <span className="subtitle">Last 6 months</span>
            </div>
            <TrendingUp className="chart-icon" />
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="sub-metrics">
            <div className="sub-metric-card">
              <Wallet className="sub-metric-icon" />
              <div>
                <h5>Net Income</h5>
                <span>${monthlyRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="sub-metric-card">
              <TrendingUp className="sub-metric-icon" />
              <div>
                <h5>YoY Growth</h5>
                <span>{revenueGrowth}%</span>
              </div>
            </div>
            <div className="sub-metric-card">
              <Building className="sub-metric-icon" />
              <div>
                <h5>Avg. per Property</h5>
                <span>
                  $
                  {properties.length > 0
                    ? (monthlyRevenue / properties.length).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Expense Breakdown */}
        <div className="chart-card expense-card">
          <div className="chart-header">
            <div>
              <h4>Expense Breakdown</h4>
              <span className="subtitle">
                Current month • Total: ${monthlyExpense}
              </span>
            </div>
            <ChartPie className="chart-icon" />
          </div>
          <div className="expense-content">
            <div className="expense-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={enhancedExpenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
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
                        className="expense-cell"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="expense-details">
              {enhancedExpenseBreakdown.map((category, index) => (
                <div
                  key={index}
                  className={`expense-category ${
                    activeExpenseIndex === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveExpenseIndex(index)}
                  onMouseLeave={() => setActiveExpenseIndex(null)}
                >
                  <div className="category-header">
                    <div className="category-title">
                      <span
                        className="category-dot"
                        style={{ backgroundColor: category.color }}
                      />
                      <h6>{category.name}</h6>
                    </div>
                    <div className="category-metrics">
                      <span className="category-amount">
                        ${category.amount.toLocaleString()}
                      </span>
                      <span className="category-percentage">
                        {category.value}%
                      </span>
                    </div>
                  </div>
                  <div className="category-breakdown">
                    {category.breakdown.map((item, itemIndex) => (
                      <div key={itemIndex} className="breakdown-item">
                        <div className="breakdown-label">
                          <span>{item.name}</span>
                        </div>
                        <div className="breakdown-values">
                          <span>${item.amount.toLocaleString()}</span>
                          <span className="breakdown-percentage">
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
      <div className="management-row">
        {/* Maintenance Metrics */}
        <div className="management-card">
          <div className="management-header">
            <div>
              <h4>Maintenance Overview</h4>
              <span className="subtitle">Current month statistics</span>
            </div>
            <Wrench className="management-icon" />
          </div>
          <div className="management-content">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={maintenanceData}>
                <XAxis dataKey="status" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="management-card">
          <div className="management-header">
            <div>
              <h4>Upcoming Renewals</h4>
              <span className="subtitle">Next 30 days</span>
            </div>
            <CalendarClock className="management-icon" />
          </div>
          <div className="renewal-list">
            <div className="renewal-item">
              <Home className="renewal-icon" />
              <div className="renewal-details">
                <h5>123 Main St, Apt 4B</h5>
                <p>Due in 7 days • Current rent: $1,500</p>
              </div>
            </div>
            <div className="renewal-item">
              <Building className="renewal-icon" />
              <div className="renewal-details">
                <h5>456 Commerce Ave, Suite 201</h5>
                <p>Due in 14 days • Current rent: $2,800</p>
              </div>
            </div>
            <div className="renewal-item">
              <Home className="renewal-icon" />
              <div className="renewal-details">
                <h5>789 Park Rd, Unit 2A</h5>
                <p>Due in 21 days • Current rent: $1,800</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Summary */}
        <div className="management-card">
          <div className="management-header">
            <div>
              <h4>Task Summary</h4>
              <span className="subtitle">Today's overview</span>
            </div>
            <CheckCircle className="management-icon" />
          </div>
          <div className="task-list">
            <div className="task-item urgent">
              <Clock className="task-icon" />
              <div className="task-details">
                <h5>Urgent Inspection</h5>
                <p>Unit 4B - Water leak reported</p>
              </div>
            </div>
            <div className="task-item">
              <Users className="task-icon" />
              <div className="task-details">
                <h5>Tenant Meeting</h5>
                <p>2:00 PM - New lease signing</p>
              </div>
            </div>
            <div className="task-item">
              <Wrench className="task-icon" />
              <div className="task-details">
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
