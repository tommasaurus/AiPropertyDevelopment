import React from "react";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar, Footer } from "./components/navbarFooter/navbarFooter";
import ClientLogin from "./components/clientLogin/clientLogin";
import Frontpage from "./components/frontpage/frontpage";
import ClientSignup from "./components/clientSignup/clientSignup";
import Dashboard from "./components/dashboard/Dashboard";
import Properties from "./components/dashboard/pages/properties/Properties";
import FinancialLedger from "./components/dashboard/pages/finances/FinancialLedger";
import Calendar from "./components/dashboard/pages/calendar/Calendar";
import TenantPage from "./components/dashboard/pages/tenants/Tenant";
import Vault from "./components/dashboard/pages/vault/Vault";
import RequireAuth from "./components/RequireAuth";

function LayoutWithNavbarFooter({ children }) {
  const location = useLocation();
  // Updated condition to handle both root and hash routes
  const showNavbarFooter =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.hash.includes("#");

  return (
    <>
      {showNavbarFooter && <Navbar />}
      {children}
      {showNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    // Force HTTPS on Vercel deployment
    if (
      window.location.protocol === "http:" &&
      window.location.hostname !== "localhost"
    ) {
      window.location.protocol = "https:";
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <LayoutWithNavbarFooter>
          <Routes>
            <Route path="/" element={<Frontpage />} />
            <Route path="/login" element={<ClientLogin />} />
            <Route path="/signup" element={<ClientSignup />} />
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="properties" element={<Properties />} />
                    <Route path="finances" element={<FinancialLedger />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="tenants" element={<TenantPage />} />
                    <Route path="vault" element={<Vault />} />
                  </Routes>
                </RequireAuth>
              }
            />
          </Routes>
        </LayoutWithNavbarFooter>
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
