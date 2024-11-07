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

  // Fetch routes data
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

  // Open the modal with the specified route and field to edit
  const openModal = (route, field) => {
    setCurrentRoute(route);
    setEditField(field);
    if (field === "pickup_locations" || field === "dropoff_locations") {
      setEditValue(route[field].join(", ")); // Convert array to comma-separated string for editing
    } else {
      setEditValue(route[field]); // Directly use the value for fields like driver_id
    }
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRoute(null);
    setEditField("");
    setEditValue("");
  };

  // Handle saving changes
  const handleSave = async () => {
    if (currentRoute) {
      try {
        let updatedRoute = { ...currentRoute };

        // Update the specific field
        if (
          editField === "pickup_locations" ||
          editField === "dropoff_locations"
        ) {
          updatedRoute[editField] = editValue
            .split(",")
            .map((item) => item.trim()); // Convert back to array
        } else {
          updatedRoute[editField] = editValue;
        }

        // Send updated data to the backend
        await api.put(`/routes/${currentRoute.route_number}`, {
          driver_type: updatedRoute.driver_type,
          driver_id: updatedRoute.driver_id,
          pickup_locations: updatedRoute.pickup_locations,
          dropoff_locations: updatedRoute.dropoff_locations,
        });

        // Update the route in the local state
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

  // Handle new route submission
  const handleNewRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPickupLocations = newRoute.pickup_locations
        .split(",")
        .map((loc) => loc.trim());
      const newDropoffLocations = newRoute.dropoff_locations
        .split(",")
        .map((loc) => loc.trim());

      const response = await api.post("/routes/", {
        ...newRoute,
        pickup_locations: newPickupLocations,
        dropoff_locations: newDropoffLocations,
      });
      setRoutes([...routes, response.data]);
    } catch (error) {
      console.error("Error creating new route:", error);
    }
  };

  return (
    <div>
      <h2>Route Management</h2>

      {/* Existing Route Table */}
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
              <td>{route.driver_name}</td> {/* Use driver_name for display */}
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

      {/* Edit Modal */}
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
