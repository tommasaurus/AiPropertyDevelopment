// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Bell, Search, Upload } from "lucide-react";
import TopNavigation from "./TopNavigation/TopNavigation";
import Sidebar from "./sidebar/Sidebar";
import DashboardMetrics from "./dashboardMetrics/dashboardMetrics";
import EmptyDashboard from "./pages/emptyDashboard/emptyDashboard";
import api from "../../services/api";
import logo from "../../assets/img/logo.png";
import Greeting from "./greeting/Greeting";
import Chat from "./chatBot/Chat";
import Map from "./Map/Map";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFields = async () => {
    try {
      const [propertiesRes, tenantsRes, incomesRes, expensesRes, leasesRes] =
        await Promise.all([
          api.get("/properties"),
          api.get("/tenants"),
          api.get("/incomes"),
          api.get("/expenses"),
          api.get("/leases"),
        ]);

      setProperties(propertiesRes.data);
      setTenants(tenantsRes.data);
      setIncomes(incomesRes.data);
      setExpenses(expensesRes.data);
      setLeases(leasesRes.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
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

  return (
    <div className="dashboard-layout">
      <Sidebar logo={logo} />
      <TopNavigation />
      <Chat />
      <main className="dashboard-main">
        <div className="art-nouveau-border">
          <div className="art-nouveau-corner top-left"></div>
          <div className="art-nouveau-corner top-right"></div>
          <div className="art-nouveau-corner bottom-left"></div>
          <div className="art-nouveau-corner bottom-right"></div>
          <div className="header-container">
            <div className="header-left"></div>
            <div className="header-actions"></div>
          </div>
          <div className="dashboard-content-wrapper">
            <DashboardMetrics
              properties={properties}
              tenants={tenants}
              incomes={incomes}
              expenses={expenses}
              leases={leases}
            />
            {properties.length === 0 ? (
              <div className="empty-dashboard-overlay">
                <EmptyDashboard />
              </div>
            ) : (
              <div className="dashboard-map-container">
                <Map />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
