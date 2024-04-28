import React, { useState, useEffect } from "react";
import "./App.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "animate.css";

function App() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedMake, setSelectedMake] = useState("");

  // function to fetch all cars, updates the cars and access token variable on execution.

  const fetchCars = async (make = "") => {
    try {
      const url = make
        ? `https://exam.razoyo.com/api/cars?make=${make}`
        : "https://exam.razoyo.com/api/cars";
      const response = await fetch(url);
      const data = await response.json();

      const token = response.headers.get("your-token");

      setAccessToken(token);

      setCars(data.cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Function to fetch data for a single car. Uses the access token from the previous function to perform the fetch.

  const fetchCarDetails = async (id) => {
    try {
      if (!accessToken) {
        console.error("Access token not found. Please authenticate first.");
        return;
      }

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
    <div className="app">
      <div className="select-params animate__animated animate__fadeIn  animate__delay-1s">
        <h2 className="select-element-title">Filter by make: </h2>
        <select onChange={(e) => handleSelectMake(e.target.value)}>
          <option value="">Any</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="Ferrari">Ferrari</option>
        </select>
      </div>
      <div className="car-list animate__animated animate__backInDown">
        {cars.map((car) => (
          <div key={car.id} className="card">
            <div className="card-header">
              <div className="car-name">
                <h2>{car.year}</h2>
                <h2>{car.make}</h2>
                <h2>{car.model}</h2>
              </div>
              {selectedCar && selectedCar.car.id === car.id ? (
                <div className="toggle-dropdown" onClick={handleCloseDetails}>
                  <p>Close details</p>
                  <IoIosArrowUp />
                </div>
              ) : (
                <div
                  className="toggle-dropdown"
                  onClick={() => handleOpenDetails(car.id)}
                >
                  <p>View details</p>
                  <IoIosArrowDown />
                </div>
              )}
            </div>
            {selectedCar && selectedCar.car.id === car.id && (
              <div className="car-details">
                <img
                  src={selectedCar.car.image}
                  alt={selectedCar.car.make}
                  className="car-img"
                />
                <div className="car-details-list">
                  <h2 className="car-detail">
                    Price: ${selectedCar.car.price}
                  </h2>
                  <h2 className="car-detail"> {selectedCar.car.mpg} MPG</h2>

                  <h2 className="car-detail">{selectedCar.car.seats} Seats</h2>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
