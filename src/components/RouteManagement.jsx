import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root");

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRouteData, setEditRouteData] = useState({});
  const [addRouteData, setAddRouteData] = useState({});
  const [volunteers, setVolunteers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const routeResponse = await api.get("/routes/");
        const volunteerResponse = await api.get("/volunteers/");
        const driverResponse = await api.get("/drivers/");

        // Store volunteers and drivers in state
        setVolunteers(volunteerResponse.data);
        setDrivers(driverResponse.data);

        // Add driver names to routes
        const updatedRoutes = routeResponse.data.map((route) => {
          let driverName = "";
          if (route.driver_type === "volunteer") {
            const driver = volunteerResponse.data.find(
              (volunteer) => volunteer.id === route.driver_id
            );
            driverName = driver
              ? `${driver.first_name} ${driver.last_name}`
              : "";
          } else {
            const driver = driverResponse.data.find(
              (driver) => driver.id === route.driver_id
            );
            driverName = driver
              ? `${driver.first_name} ${driver.last_name}`
              : "";
          }
          return { ...route, driver_name: driverName };
        });

        setRoutes(updatedRoutes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const openEditModal = (route) => {
    setEditRouteData(route);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditRouteData({});
  };

  const handleEditRouteChange = (e) => {
    const { name, value } = e.target;
    setEditRouteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDriverTypeChangeEdit = (selectedOption) => {
    setEditRouteData((prevData) => ({
      ...prevData,
      driver_type: selectedOption.value,
    }));

    // Set driver options based on selected driver type
    const options =
      selectedOption.value === "volunteer"
        ? volunteers.map((volunteer) => ({
            value: volunteer.id,
            label: `${volunteer.first_name} ${volunteer.last_name}`,
          }))
        : drivers.map((driver) => ({
            value: driver.id,
            label: `${driver.first_name} ${driver.last_name}`,
          }));
    setDriverOptions(options);
  };

  const handleDriverChangeEdit = (selectedOption) => {
    setEditRouteData((prevData) => ({
      ...prevData,
      driver_id: selectedOption.value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRoute = {
        ...editRouteData,
        pickup_locations: Array.isArray(editRouteData.pickup_locations)
          ? editRouteData.pickup_locations
          : editRouteData.pickup_locations.split(",").map((loc) => loc.trim()),
        dropoff_locations: Array.isArray(editRouteData.dropoff_locations)
          ? editRouteData.dropoff_locations
          : editRouteData.dropoff_locations.split(",").map((loc) => loc.trim()),
      };

      const response = await api.put(
        `/routes/${editRouteData.route_number}`,
        updatedRoute
      );

      if (response.status === 200) {
        console.log("Edit saved successfully:", response.data);

        // Determine driver_name based on driver_type and driver_id
        let driverName = "";
        if (editRouteData.driver_type === "volunteer") {
          const driver = volunteers.find(
            (volunteer) => volunteer.id === editRouteData.driver_id
          );
          driverName = driver ? `${driver.first_name} ${driver.last_name}` : "";
        } else {
          const driver = drivers.find(
            (driver) => driver.id === editRouteData.driver_id
          );
          driverName = driver ? `${driver.first_name} ${driver.last_name}` : "";
        }

        const updatedRouteWithDriverName = {
          ...response.data,
          driver_name: driverName,
        };

        setRoutes(
          routes.map((route) =>
            route.route_number === editRouteData.route_number
              ? updatedRouteWithDriverName
              : route
          )
        );

        setEditRouteData({});
        setIsModalOpen(false);
      } else {
        console.error("Failed to save edit:", response);
      }
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const openAddModal = () => {
    setAddRouteData({});
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddRouteChange = (e) => {
    const { name, value } = e.target;
    setAddRouteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDriverTypeChange = (selectedOption) => {
    setAddRouteData((prevData) => ({
      ...prevData,
      driver_type: selectedOption.value,
    }));

    // Set driver options based on selected driver type
    const options =
      selectedOption.value === "volunteer"
        ? volunteers.map((volunteer) => ({
            value: volunteer.id,
            label: `${volunteer.first_name} ${volunteer.last_name}`,
          }))
        : drivers.map((driver) => ({
            value: driver.id,
            label: `${driver.first_name} ${driver.last_name}`,
          }));
    setDriverOptions(options);
  };

  const handleDriverChange = (selectedOption) => {
    setAddRouteData((prevData) => ({
      ...prevData,
      driver_id: selectedOption.value,
    }));
  };

  const handleAddRoute = async () => {
    try {
      const newRoute = {
        ...addRouteData,
        pickup_locations: addRouteData.pickup_locations
          .split(",")
          .map((loc) => loc.trim()),
        dropoff_locations: addRouteData.dropoff_locations
          .split(",")
          .map((loc) => loc.trim()),
      };
      const response = await api.post("/routes/", newRoute);
      setRoutes([...routes, response.data]);
    } catch (error) {
      console.error("Error adding route:", error);
    }
    closeAddModal();
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Route Management</h2>

      {/* Add Route Button */}
      <div className="mb-4 d-flex justify-content-end">
        <button className="btn btn-success" onClick={openAddModal}>
          Add Route
        </button>
      </div>

      {/* Route Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Route Number</th>
            <th>Pickup Locations</th>
            <th>Dropoff Locations</th>
            <th>Driver Type</th>
            <th>Driver Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.route_number}>
              <td>{route.route_number}</td>
              <td>{route.pickup_locations.join(", ")}</td>
              <td>{route.dropoff_locations.join(", ")}</td>
              <td>{route.driver_type}</td>
              <td>{route.driver_name}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => openEditModal(route)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing Route */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Route Modal"
      >
        <h2>Edit Route</h2>
        <input
          type="text"
          name="pickup_locations"
          value={editRouteData.pickup_locations || ""}
          onChange={handleEditRouteChange}
          placeholder="Pickup Locations (comma-separated)"
          className="form-control mb-3"
        />
        <input
          type="text"
          name="dropoff_locations"
          value={editRouteData.dropoff_locations || ""}
          onChange={handleEditRouteChange}
          placeholder="Dropoff Locations (comma-separated)"
          className="form-control mb-3"
        />
        <Select
          options={[
            { value: "volunteer", label: "Volunteer" },
            { value: "employed_driver", label: "Employed Driver" },
          ]}
          value={{
            value: editRouteData.driver_type,
            label: editRouteData.driver_type,
          }}
          onChange={handleDriverTypeChangeEdit}
          placeholder="Select Driver Type"
          className="mb-3"
        />
        <Select
          options={driverOptions}
          value={driverOptions.find(
            (option) => option.value === editRouteData.driver_id
          )}
          onChange={handleDriverChangeEdit}
          placeholder="Select Driver"
          className="mb-3"
        />
        <button className="btn btn-success me-2" onClick={handleSaveEdit}>
          Save Changes
        </button>
        <button className="btn btn-secondary" onClick={closeEditModal}>
          Cancel
        </button>
      </Modal>

      {/* Modal for Adding Route */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Route Modal"
      >
        <h2>Add Route</h2>
        <input
          type="text"
          name="pickup_locations"
          value={addRouteData.pickup_locations || ""}
          onChange={handleAddRouteChange}
          placeholder="Pickup Locations (comma-separated)"
          className="form-control mb-3"
        />
        <input
          type="text"
          name="dropoff_locations"
          value={addRouteData.dropoff_locations || ""}
          onChange={handleAddRouteChange}
          placeholder="Dropoff Locations (comma-separated)"
          className="form-control mb-3"
        />
        <Select
          options={[
            { value: "volunteer", label: "Volunteer" },
            { value: "employed_driver", label: "Employed Driver" },
          ]}
          onChange={handleDriverTypeChange}
          placeholder="Select Driver Type"
          className="mb-3"
        />
        <Select
          options={driverOptions}
          onChange={handleDriverChange}
          placeholder="Select Driver"
          className="mb-3"
        />
        <button className="btn btn-success me-2" onClick={handleAddRoute}>
          Add Route
        </button>
        <button className="btn btn-secondary" onClick={closeAddModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default RouteManagement;
