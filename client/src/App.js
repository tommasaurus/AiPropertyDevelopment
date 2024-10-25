import React from "react";
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
import Properties from "./components/dashboard/properties/Properties";
import RequireAuth from "./components/RequireAuth";

function LayoutWithNavbarFooter({ children }) {
  const location = useLocation();
  // Check if current path is Frontpage or ClientSignup
  const showNavbarFooter = location.pathname === "/";

  return (
    <>
      {showNavbarFooter && <Navbar />}
      {children}
      {showNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className='App'>
        <LayoutWithNavbarFooter>
          <Routes>
            <Route path='/' element={<Frontpage />} />
            <Route path='/login' element={<ClientLogin />} />
            <Route path='/signup' element={<ClientSignup />} />
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="properties" element={<Properties />} />                    
                  </Routes>
                </RequireAuth>
              }
            />
          </Routes>
        </LayoutWithNavbarFooter>
      </div>
    </Router>
  );
}

export default App;
