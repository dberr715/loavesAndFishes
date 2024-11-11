import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";

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
    const filtered = routes.filter((route) => {
      return (
        route.route_number.toString().includes(value) ||
        route.pickup_locations.join(", ").toLowerCase().includes(value) ||
        route.dropoff_locations.join(", ").toLowerCase().includes(value) ||
        (route.driver_type + ": " + route.driver_id)
          .toLowerCase()
          .includes(value)
      );
    });
    setFilteredRoutes(filtered);
  };

  // Handle Sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedRoutes = [...filteredRoutes].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
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
