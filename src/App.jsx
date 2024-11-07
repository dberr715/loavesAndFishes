import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import AdminManagement from "./components/AdminManagement.jsx";

import RouteManagement from "./components/RouteManagement.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/route-management">Route Management</Link>
            </li>
            <li>
              <Link to="/admin-management">Admin Management</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<h1>Welcome to the Food Routing System</h1>}
          />
          <Route path="/route-management" element={<RouteManagement />} />
          <Route path="/admin-management" element={<AdminManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
