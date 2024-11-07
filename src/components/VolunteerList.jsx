import React, { useEffect, useState } from "react";
import api from "../api";

function VolunteerList() {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const response = await api.get("/volunteers/");
        setVolunteers(response.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    }

    fetchVolunteers();
  }, []);

  return (
    <div>
      <h2>Volunteers</h2>
      <ul>
        {volunteers.map((volunteer) => (
          <li key={volunteer.id}>
            {volunteer.first_name} {volunteer.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VolunteerList;
