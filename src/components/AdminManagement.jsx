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
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [addItemType, setAddItemType] = useState("");
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
  const openEditModal = (item, field) => {
    setCurrentEditItem(item);
    setEditField(field);
    setEditValue(
      field === "name" ? `${item.first_name} ${item.last_name}` : item[field]
    );
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentEditItem(null);
    setEditValue("");
    setEditField("");
  };

  const handleSaveEdit = async () => {
    try {
      if (currentEditItem) {
        const updatedItem = { ...currentEditItem };

        if (editField === "name") {
          // Editing volunteer or driver name
          const [firstName, lastName] = editValue.split(" ");
          updatedItem.first_name = firstName || "";
          updatedItem.last_name = lastName || "";

          if (currentEditItem.driver_id !== undefined) {
            // Update Driver
            await api.put(`/drivers/${currentEditItem.id}`, {
              first_name: updatedItem.first_name,
              last_name: updatedItem.last_name,
            });
            setDrivers(
              drivers.map((driver) =>
                driver.id === updatedItem.id ? updatedItem : driver
              )
            );
          } else {
            // Update Volunteer
            await api.put(`/volunteers/${currentEditItem.id}`, {
              first_name: updatedItem.first_name,
              last_name: updatedItem.last_name,
            });
            setVolunteers(
              volunteers.map((volunteer) =>
                volunteer.id === updatedItem.id ? updatedItem : volunteer
              )
            );
          }
        } else if (editField === "route_number") {
          // Editing route number
          updatedItem.route_number = parseInt(editValue, 10);
          await api.put(`/routes/${currentEditItem.route_number}`, updatedItem);
          setRoutes(
            routes.map((route) =>
              route.route_number === currentEditItem.route_number
                ? updatedItem
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
                    onClick={() => openEditModal(volunteer, "name")}
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
                    onClick={() => openEditModal(driver, "name")}
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
                    onClick={() => openEditModal(route, "route_number")}
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

      {/* Modal for Editing */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Modal"
      >
        <h2>Edit {editField === "name" ? "Name" : "Route Number"}</h2>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Edit value"
          className="form-control mb-3"
        />
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
        <h2>
          Add{" "}
          {addItemType === "volunteer"
            ? "Volunteer"
            : addItemType === "driver"
            ? "Driver"
            : "Route"}
        </h2>
        <div>
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
                name="route_number"
                value={addItemData.route_number || ""}
                onChange={handleAddItemChange}
                placeholder="Route Number"
                className="form-control mb-3"
              />
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
        </div>
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
