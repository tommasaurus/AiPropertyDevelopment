import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  MessagesSquare,
  Pin,
  Vault,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../../assets/img/logo.png";
import tabLogo from "../../../assets/img/tabLogoBlack.png";

const Sidebar = () => {
  const [isPinned, setPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint to clear the HTTP-only refresh token cookie
      await api.post("/auth/logout");

      // Clear any localStorage or sessionStorage data
      localStorage.removeItem("access_token"); // Clear access token if stored
      localStorage.removeItem("userData"); // Clear any user-related data
      sessionStorage.clear();

      // Clear Axios default Authorization header
      delete api.defaults.headers.common["Authorization"];

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      active: window.location.pathname === "/dashboard",
    },
    {
      icon: Building2,
      label: "Properties",
      path: "/dashboard/properties",
      active: window.location.pathname === "/dashboard/properties",
    },
    {
      icon: Calendar,
      label: "Calendar",
      path: "/dashboard/calendar",
      active: window.location.pathname === "/dashboard/calendar",
    },
    {
      icon: UserCircle,
      label: "Tenants",
      path: "/dashboard/tenants",
      active: window.location.pathname === "/dashboard/tenants",
    },
    {
      icon: MessagesSquare,
      label: "Messages",
      path: "/dashboard/messages",
      active: window.location.pathname === "/dashboard/messages",
    },
    {
      icon: Vault,
      label: "Vault",
      path: "/dashboard/vault",
      active: window.location.pathname === "/dashboard/vault",
    },
  ];

  const bottomNavItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      active: window.location.pathname === "/settings",
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
    },
  ];

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const togglePin = () => {
    setPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const handleNavigation = (path, action) => {
    if (action) {
      action();
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    // Only apply to dashboard pages
    if (window.location.pathname.startsWith("/dashboard")) {
      document.body.classList.toggle("dashboard-sidebar-expanded", isExpanded);
      return () => {
        document.body.classList.remove("dashboard-sidebar-expanded");
      };
    }
  }, [isExpanded]);

  const renderNavItem = (item, index) => {
    const Icon = item.icon;
    return (
      <button
        key={index}
        className={`nav-item ${item.active ? "active" : ""}`}
        onClick={() => handleNavigation(item.path, item.action)}
        title={!isExpanded ? item.label : ""}
      >
        <div className="nav-item-content">
          <Icon size={24} />
          <span className="nav-label">{item.label}</span>
        </div>
      </button>
    );
  };

  return (
    <aside
      className={`dashboard-sidebar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={tabLogo} className="tab-logo" alt="Tab Logo" />
          <img src={logo} className="logo" alt="Dwellex Logo" />
        </div>
        <button
          className={`pin-button ${isPinned ? "pinned" : ""}`}
          onClick={togglePin}
          aria-label={isPinned ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Pin size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">{navItems.map(renderNavItem)}</div>
        <div className="nav-section bottom">
          {bottomNavItems.map(renderNavItem)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
