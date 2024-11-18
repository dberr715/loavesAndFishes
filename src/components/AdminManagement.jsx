import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AdminManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [addItemType, setAddItemType] = useState("");
  const [editItemData, setEditItemData] = useState({});
  const [addItemData, setAddItemData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const volunteerResponse = await api.get("/volunteers/");
        const driverResponse = await api.get("/drivers/");
        const routeResponse = await api.get("/routes/");
        setVolunteers(volunteerResponse.data);
        setDrivers(driverResponse.data);
        setRoutes(routeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Handlers for Deleting Items
  const handleDeleteVolunteer = async (id) => {
    try {
      await api.delete(`/volunteers/${id}`);
      setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id));
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      setDrivers(drivers.filter((driver) => driver.id !== id));
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleDeleteRoute = async (route_number) => {
    try {
      await api.delete(`/routes/${route_number}`);
      setRoutes(routes.filter((route) => route.route_number !== route_number));
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  // Handlers for Editing Items
  const openEditModal = (item, type) => {
    setCurrentEditItem({ ...item, type });
    setEditItemData({ ...item });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentEditItem(null);
    setEditItemData({});
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      if (currentEditItem) {
        if (currentEditItem.type === "volunteer") {
          await api.put(`/volunteers/${editItemData.id}`, editItemData);
          setVolunteers(
            volunteers.map((volunteer) =>
              volunteer.id === editItemData.id ? editItemData : volunteer
            )
          );
        } else if (currentEditItem.type === "driver") {
          await api.put(`/drivers/${editItemData.id}`, editItemData);
          setDrivers(
            drivers.map((driver) =>
              driver.id === editItemData.id ? editItemData : driver
            )
          );
        } else if (currentEditItem.type === "route") {
          const updatedRoute = {
            ...editItemData,
            pickup_locations: editItemData.pickup_locations
              .split(",")
              .map((loc) => loc.trim()),
            dropoff_locations: editItemData.dropoff_locations
              .split(",")
              .map((loc) => loc.trim()),
          };
          // We do not allow editing the route_number
          delete updatedRoute.route_number;

          await api.put(
            `/routes/${currentEditItem.route_number}`,
            updatedRoute
          );
          setRoutes(
            routes.map((route) =>
              route.route_number === currentEditItem.route_number
                ? { ...route, ...updatedRoute }
                : route
            )
          );
        }
      }
    } catch (error) {
      console.error("Error saving edit:", error);
    }
    closeEditModal();
  };

  // Handlers for Adding Items
  const openAddModal = (itemType) => {
    setAddItemType(itemType);
    setAddItemData({});
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddItemType("");
  };

  const handleAddItemChange = (e) => {
    const { name, value } = e.target;
    setAddItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = async () => {
    try {
      if (addItemType === "volunteer") {
        const newVolunteer = { ...addItemData };
        const response = await api.post("/volunteers/", newVolunteer);
        setVolunteers([...volunteers, response.data]);
      } else if (addItemType === "driver") {
        const newDriver = { ...addItemData };
        const response = await api.post("/drivers/", newDriver);
        setDrivers([...drivers, response.data]);
      } else if (addItemType === "route") {
        const newRoute = {
          ...addItemData,
          pickup_locations: addItemData.pickup_locations
            .split(",")
            .map((loc) => loc.trim()),
          dropoff_locations: addItemData.dropoff_locations
            .split(",")
            .map((loc) => loc.trim()),
        };
        const response = await api.post("/routes/", newRoute);
        setRoutes([...routes, response.data]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
    closeAddModal();
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Management</h2>

      {/* Volunteers Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Volunteers</h3>
          <button
            className="btn btn-success btn-sm"
            onClick={() => openAddModal("volunteer")}
          >
            Add Volunteer
          </button>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {volunteers.map((volunteer) => (
              <li
                key={volunteer.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {volunteer.first_name} {volunteer.last_name}
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => openEditModal(volunteer, "volunteer")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteVolunteer(volunteer.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Drivers Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Drivers</h3>
          <button
            className="btn btn-success btn-sm"
            onClick={() => openAddModal("driver")}
          >
            Add Driver
          </button>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {drivers.map((driver) => (
              <li
                key={driver.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {driver.first_name} {driver.last_name}
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => openEditModal(driver, "driver")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Routes Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Routes</h3>
          <button
            className="btn btn-success btn-sm"
            onClick={() => openAddModal("route")}
          >
            Add Route
          </button>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {routes.map((route) => (
              <li
                key={route.route_number}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                Route #{route.route_number}
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => openEditModal(route, "route")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRoute(route.route_number)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for Editing Items */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Modal"
      >
        <h2>Edit {currentEditItem?.type}</h2>
        {currentEditItem?.type === "volunteer" ||
        currentEditItem?.type === "driver" ? (
          <>
            <input
              type="text"
              name="first_name"
              value={editItemData.first_name || ""}
              onChange={handleEditItemChange}
              placeholder="First Name"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="last_name"
              value={editItemData.last_name || ""}
              onChange={handleEditItemChange}
              placeholder="Last Name"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="address"
              value={editItemData.address || ""}
              onChange={handleEditItemChange}
              placeholder="Address"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="phone_number"
              value={editItemData.phone_number || ""}
              onChange={handleEditItemChange}
              placeholder="Phone Number"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="notes"
              value={editItemData.notes || ""}
              onChange={handleEditItemChange}
              placeholder="Notes"
              className="form-control mb-3"
            />
          </>
        ) : currentEditItem?.type === "route" ? (
          <>
            <input
              type="text"
              name="driver_type"
              value={editItemData.driver_type || ""}
              onChange={handleEditItemChange}
              placeholder="Driver Type"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="driver_id"
              value={editItemData.driver_id || ""}
              onChange={handleEditItemChange}
              placeholder="Driver ID"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="pickup_locations"
              value={editItemData.pickup_locations || ""}
              onChange={handleEditItemChange}
              placeholder="Pickup Locations (comma-separated)"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="dropoff_locations"
              value={editItemData.dropoff_locations || ""}
              onChange={handleEditItemChange}
              placeholder="Dropoff Locations (comma-separated)"
              className="form-control mb-3"
            />
          </>
        ) : null}
        <button className="btn btn-success me-2" onClick={handleSaveEdit}>
          Save Changes
        </button>
        <button className="btn btn-secondary" onClick={closeEditModal}>
          Cancel
        </button>
      </Modal>

      {/* Modal for Adding Items */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Modal"
      >
        <h2>Add {addItemType}</h2>
        {addItemType === "volunteer" || addItemType === "driver" ? (
          <>
            <input
              type="text"
              name="first_name"
              value={addItemData.first_name || ""}
              onChange={handleAddItemChange}
              placeholder="First Name"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="last_name"
              value={addItemData.last_name || ""}
              onChange={handleAddItemChange}
              placeholder="Last Name"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="address"
              value={addItemData.address || ""}
              onChange={handleAddItemChange}
              placeholder="Address"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="phone_number"
              value={addItemData.phone_number || ""}
              onChange={handleAddItemChange}
              placeholder="Phone Number"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="notes"
              value={addItemData.notes || ""}
              onChange={handleAddItemChange}
              placeholder="Notes"
              className="form-control mb-3"
            />
          </>
        ) : addItemType === "route" ? (
          <>
            <input
              type="text"
              name="driver_type"
              value={addItemData.driver_type || ""}
              onChange={handleAddItemChange}
              placeholder="Driver Type"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="driver_id"
              value={addItemData.driver_id || ""}
              onChange={handleAddItemChange}
              placeholder="Driver ID"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="pickup_locations"
              value={addItemData.pickup_locations || ""}
              onChange={handleAddItemChange}
              placeholder="Pickup Locations (comma-separated)"
              className="form-control mb-3"
            />
            <input
              type="text"
              name="dropoff_locations"
              value={addItemData.dropoff_locations || ""}
              onChange={handleAddItemChange}
              placeholder="Dropoff Locations (comma-separated)"
              className="form-control mb-3"
            />
          </>
        ) : null}
        <button className="btn btn-success me-2" onClick={handleAddItem}>
          Add {addItemType}
        </button>
        <button className="btn btn-secondary" onClick={closeAddModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default AdminManagement;
