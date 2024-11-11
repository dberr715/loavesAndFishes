import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminManagement from "./components/AdminManagement.jsx";
import RouteManagement from "./components/RouteManagement.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/route-management">
                Route Management
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin-management">
                Admin Management
              </Link>
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
