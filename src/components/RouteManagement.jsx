import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement("#root");

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [dateFilter, setDateFilter] = useState(null);
  const [routeDates, setRouteDates] = useState({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await api.get("/routes/");
        setRoutes(response.data);
        setFilteredRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    }
    fetchRoutes();
  }, []);

  // Handle Filter Change
  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilter(value);
    filterRoutes(value, dateFilter);
  };

  // Handle Date Filter Change
  const handleDateFilterChange = (date) => {
    setDateFilter(date);
    filterRoutes(filter, date);
    setIsDatePickerOpen(false);
  };

  const handleClearDateFilter = () => {
    setDateFilter(null);
    filterRoutes(filter, null);
  };

  const filterRoutes = (textFilter, dateFilter) => {
    let filtered = routes.filter((route) => {
      return (
        route.route_number.toString().includes(textFilter) ||
        route.pickup_locations.join(", ").toLowerCase().includes(textFilter) ||
        route.dropoff_locations.join(", ").toLowerCase().includes(textFilter) ||
        (route.driver_type + ": " + route.driver_id)
          .toLowerCase()
          .includes(textFilter)
      );
    });

    if (dateFilter) {
      filtered = filtered.filter((route) => {
        const routeDate = routeDates[route.route_number];
        return (
          routeDate && routeDate.toDateString() === dateFilter.toDateString()
        );
      });
    }

    setFilteredRoutes(filtered);
  };

  // Handle Sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedRoutes = [...filteredRoutes].sort((a, b) => {
      if (key === "date") {
        const dateA = routeDates[a.route_number];
        const dateB = routeDates[b.route_number];
        if (dateA < dateB) return direction === "ascending" ? -1 : 1;
        if (dateA > dateB) return direction === "ascending" ? 1 : -1;
        return 0;
      } else {
        if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });

    setSortConfig({ key, direction });
    setFilteredRoutes(sortedRoutes);
  };

  const openModal = (route, field) => {
    setCurrentRoute(route);
    setEditField(field);
    setEditValue(route[field] || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoute(null);
    setEditField("");
    setEditValue("");
  };

  const handleSave = async () => {
    if (currentRoute) {
      try {
        let updatedRoute = { ...currentRoute };

        if (
          editField === "pickup_locations" ||
          editField === "dropoff_locations"
        ) {
          updatedRoute[editField] = editValue
            .split(",")
            .map((item) => item.trim());
        } else {
          updatedRoute[editField] = editValue;
        }

        // Update the route on the backend
        await api.put(`/routes/${currentRoute.route_number}`, updatedRoute);

        // Update the route in the state
        setRoutes(
          routes.map((route) =>
            route.route_number === currentRoute.route_number
              ? updatedRoute
              : route
          )
        );
        setFilteredRoutes(
          filteredRoutes.map((route) =>
            route.route_number === currentRoute.route_number
              ? updatedRoute
              : route
          )
        );
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
    closeModal();
  };

  const handleDateChange = (routeNumber, date) => {
    setRouteDates({ ...routeDates, [routeNumber]: date });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Route Management</h2>

      {/* Filter Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter routes by any field..."
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Date Filter Button and Picker */}
      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        >
          {isDatePickerOpen ? "Close Date Picker" : "Filter by Date"}
        </button>
        {isDatePickerOpen && (
          <div className="mb-3">
            <DatePicker
              selected={dateFilter}
              onChange={handleDateFilterChange}
              className="form-control"
              placeholderText="Select date"
            />
          </div>
        )}
        {dateFilter && (
          <button className="btn btn-secondary" onClick={handleClearDateFilter}>
            Clear Date Filter
          </button>
        )}
      </div>

      {/* Route Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("route_number")}
              style={{ cursor: "pointer" }}
            >
              Route Number{" "}
              {sortConfig.key === "route_number" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("pickup_locations")}
              style={{ cursor: "pointer" }}
            >
              Pickup Locations{" "}
              {sortConfig.key === "pickup_locations" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("dropoff_locations")}
              style={{ cursor: "pointer" }}
            >
              Dropoff Locations{" "}
              {sortConfig.key === "dropoff_locations" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("driver_id")}
              style={{ cursor: "pointer" }}
            >
              Driver{" "}
              {sortConfig.key === "driver_id" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("date")}
              style={{ cursor: "pointer" }}
            >
              Date{" "}
              {sortConfig.key === "date" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map((route) => (
            <tr key={route.route_number}>
              <td>{route.route_number}</td>
              <td>{route.pickup_locations.join(", ")}</td>
              <td>{route.dropoff_locations.join(", ")}</td>
              <td>
                {route.driver_type}: {route.driver_id}
              </td>
              <td>
                <DatePicker
                  selected={routeDates[route.route_number] || null}
                  onChange={(date) =>
                    handleDateChange(route.route_number, date)
                  }
                  className="form-control"
                  placeholderText="Select date"
                />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModal(route, "pickup_locations")}
                >
                  Edit Pickup
                </button>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openModal(route, "dropoff_locations")}
                >
                  Edit Dropoff
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal(route, "driver_id")}
                >
                  Edit Driver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
      >
        <h2>
          Edit {editField} for Route {currentRoute?.route_number}
        </h2>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={`Edit ${editField}`}
          className="form-control mb-3"
        />
        <button className="btn btn-success me-2" onClick={handleSave}>
          Save Changes
        </button>
        <button className="btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default RouteManagement;
