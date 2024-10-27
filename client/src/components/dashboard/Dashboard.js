import React, { useEffect, useState } from "react";
import { PlusCircle, Bell, Search } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";
import DashboardMetrics from "./dashboardMetrics/dashboardMetrics";
import api from "../../services/api";
import logo from "../../images/logo.png";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // TODO: Replace with actual API call to get user/business name
  const businessName = "Jason.";

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning,");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon,");
      } else {
        setGreeting("Good evening,");
      }
    };

    // Set initial greeting
    updateGreeting();

    // Update greeting every minute
    const timer = setInterval(updateGreeting, 60000);

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  // Handle sidebar expansion
  useEffect(() => {
    const mainContent = document.querySelector(".dashboard-main");
    const handleSidebarChange = () => {
      if (document.body.classList.contains("dashboard-sidebar-expanded")) {
        mainContent?.classList.add("sidebar-expanded");
      } else {
        mainContent?.classList.remove("sidebar-expanded");
      }
    };

    // Initial check
    handleSidebarChange();

    // Create observer to watch for class changes
    const observer = new MutationObserver(handleSidebarChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='dashboard-layout'>
      {/* Sidebar with imported logo */}
      <Sidebar logo={logo} />

      <main className='dashboard-main'>
        {/* Greeting Section */}
        <div className='greeting-section'>
          <div>
            <h1 className='greeting-title'>
              {greeting} {businessName}
            </h1>
            <p className='greeting-date'>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <DashboardMetrics properties={properties} />
      </main>
    </div>
  );
};

export default Dashboard;
