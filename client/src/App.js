import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Footer } from "./component/navbarFooter/navbarFooter";
import Frontpage from "./component/frontpage/frontpage";

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <Frontpage />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
