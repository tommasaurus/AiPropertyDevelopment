// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { PlusCircle, Bell, Search } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";
import DashboardMetrics from "./dashboardMetrics/dashboardMetrics";
import EmptyDashboard from "./emptyDashboard/emptyDashboard";
import api from "../../services/api";
import logo from "../../images/logo.png";
import Greeting from "./greeting/Greeting";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);  
  const [loading, setLoading] = useState(true);
  const businessName = "Jason.";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector(".dashboard-main");
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (properties.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className='dashboard-layout'>
      <Sidebar logo={logo} />
      <main className='dashboard-main'>
        <div className="art-nouveau-border">
          <div className="art-nouveau-corner top-left"></div>
          <div className="art-nouveau-corner top-right"></div>
          <div className="art-nouveau-corner bottom-left"></div>
          <div className="art-nouveau-corner bottom-right"></div>
          <Greeting/>
          <DashboardMetrics properties={properties} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;