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
    <div>
      <h2>Admin Management</h2>
      <div>
        <h3>Volunteers</h3>
        <ul>
          {volunteers.map((volunteer) => (
            <li key={volunteer.id}>
              {volunteer.first_name} {volunteer.last_name}
              <button onClick={() => handleDeleteVolunteer(volunteer.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Drivers</h3>
        <ul>
          {drivers.map((driver) => (
            <li key={driver.id}>
              {driver.first_name} {driver.last_name}
              <button onClick={() => handleDeleteDriver(driver.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Routes</h3>
        <ul>
          {routes.map((route) => (
            <li key={route.route_number}>
              Route #{route.route_number}
              <button onClick={() => handleDeleteRoute(route.route_number)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminManagement;
