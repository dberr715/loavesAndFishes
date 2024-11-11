import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminManagement from "./components/AdminManagement.jsx";
import RouteManagement from "./components/RouteManagement.jsx";

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Food Routing System
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
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
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <h1 className="text-center">
                  Welcome to the Food Routing System
                </h1>
              }
            />
            <Route path="/route-management" element={<RouteManagement />} />
            <Route path="/admin-management" element={<AdminManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
