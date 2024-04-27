import React, { useState, useEffect } from "react";
import "./App.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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

      
      const token = response.headers.get("your-token");
      setAccessToken(token);

      
      setCars(data.cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  
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
      <select onChange={(e) => handleSelectMake(e.target.value)}>
        <option value="">All Makes</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Ford">Ford</option>
        <option value="Ferrari">Ferrari</option>
      </select>
      <div className="car-list">
        {cars.map((car) => (
          <div key={car.id} className="card">
            <h2>{car.make}</h2>
            <h2>{car.model}</h2>
            {selectedCar && selectedCar.car.id === car.id ? (
              <div className="car-details">
                <IoIosArrowUp onClick={handleCloseDetails} />

                <img src={selectedCar.car.image} alt={selectedCar.car.make} />
                <h2>price:{selectedCar.car.price}</h2>
              </div>
            ) : (
              <IoIosArrowDown onClick={() => handleOpenDetails(car.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
