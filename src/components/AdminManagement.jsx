import React, { useEffect, useState } from "react";
import api from "../api";

function AdminManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Management</h2>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Volunteers</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {volunteers.map((volunteer) => (
              <li
                key={volunteer.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {volunteer.first_name} {volunteer.last_name}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteVolunteer(volunteer.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Drivers</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {drivers.map((driver) => (
              <li
                key={driver.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {driver.first_name} {driver.last_name}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteDriver(driver.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Routes</h3>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {routes.map((route) => (
              <li
                key={route.route_number}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                Route #{route.route_number}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteRoute(route.route_number)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminManagement;
