import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";

Modal.setAppElement("#root");

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await api.get("/routes/");
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    }
    fetchRoutes();
  }, []);

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
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
    closeModal();
  };

  return (
    <div>
      <h2>Route Management</h2>
      <table>
        <thead>
          <tr>
            <th>Route Number</th>
            <th>Pickup Locations</th>
            <th>Dropoff Locations</th>
            <th>Driver</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.route_number}>
              <td>{route.route_number}</td>
              <td>{route.pickup_locations.join(", ")}</td>
              <td>{route.dropoff_locations.join(", ")}</td>
              <td>
                {route.driver_type}: {route.driver_id}
              </td>
              <td>
                <button onClick={() => openModal(route, "pickup_locations")}>
                  Edit Pickup
                </button>
                <button onClick={() => openModal(route, "dropoff_locations")}>
                  Edit Dropoff
                </button>
                <button onClick={() => openModal(route, "driver_id")}>
                  Edit Driver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        />
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default RouteManagement;
