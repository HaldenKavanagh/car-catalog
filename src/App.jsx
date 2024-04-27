import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedMake, setSelectedMake] = useState("");

  const fetchCars = async (make = "") => {
    try {
      const url = make
        ? `https://exam.razoyo.com/api/cars?make=${make}`
        : "https://exam.razoyo.com/api/cars";
      const response = await fetch(url);
      const data = await response.json();

      // Extract and store the token from the response headers
      const token = response.headers.get("your-token");
      setAccessToken(token);

      // Set cars state
      setCars(data.cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Function to fetch car details from the API
  const fetchCarDetails = async (id) => {
    try {
      // Check if access token exists
      if (!accessToken) {
        console.error("Access token not found. Please authenticate first.");
        return;
      }

      // Fetch car details using the access token
      const response = await fetch(`https://exam.razoyo.com/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCar(data);
        console.log(data);
      } else if (response.status === 403) {
        console.error("Unauthorized access:", response.statusText);
      } else if (response.status === 404) {
        console.error("Car not found:", response.statusText);
      } else {
        console.error("Error fetching car details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleOpenDetails = (id) => {
    fetchCarDetails(id);
  };

  const handleCloseDetails = () => {
    setSelectedCar(null);
  };

  const handleSelectMake = (make) => {
    setSelectedMake(make);
  };

  useEffect(() => {
    fetchCars(selectedMake);
  }, [selectedMake]);

  return (
    <div className="App">
      <select onChange={(e) => handleSelectMake(e.target.value)}>
        <option value="">All Makes</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
      </select>
      <div className="car-list">
        {cars.map((car) => (
          <div key={car.id} className="car">
            <h2>{car.make}</h2>
            <h2>{car.model}</h2>
            {selectedCar && selectedCar.car.id === car.id ? (
              <div className="car-details">
                <button onClick={handleCloseDetails}>Close</button>
                <h2>price:{selectedCar.car.price}</h2>
                <img src={selectedCar.car.image} alt={selectedCar.car.make} />
              </div>
            ) : (
              <button onClick={() => handleOpenDetails(car.id)}>Open</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
