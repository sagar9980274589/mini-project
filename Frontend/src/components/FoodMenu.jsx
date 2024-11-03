import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import "./FoodMenu.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './QRCodeGenerator.css';

const FoodMenu = () => {
  const { email } = useParams(); // Get email from URL params
  const [serialNumber, setSerialNumber] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [mainDomain, setMainDomain] = useState(window.location.origin);

  const handleGenerate = () => {
    const number = parseInt(serialNumber, 10);
    if (number > 0 && email) {
      const predefinedUrl = `${mainDomain}/displaymenu/${email}`; // Construct URL with email
      const newCodes = Array.from({ length: number }, (_, i) => `${predefinedUrl}?serial=${i + 1}`);
      setGeneratedCodes(newCodes);
      setSerialNumber('');
    } else {
      alert("Please enter a valid number greater than zero.");
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    alert("Copied to clipboard!");
  };
  const [foodItems, setFoodItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State for user email
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!isAuthenticated) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email; // Extract user email
      setUserEmail(email); // Store email in state

      try {
        const response = await axios.get(
          `https://mini-project-1-bffa.onrender.com/api/menuItems?userEmail=${email}`
        );
        setFoodItems(response.data);
      } catch (error) {
        setError("Error fetching menu items.");
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [isAuthenticated]);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(foodItems.length, 1));
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.max(foodItems.length, 1)) % Math.max(foodItems.length, 1));
  };

  const itemGroups = [];
  for (let i = 0; i < foodItems.length; i += 7) {
    itemGroups.push(foodItems.slice(i, i + 7));
  }

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to the login page
  };

  return (
    <div>
      <div className="carousel-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <h1>Food Menu</h1>
        {userEmail && <h2>Logged in as: {userEmail}</h2>} {/* Display user email */}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : foodItems.length === 0 ? (
          <div className="empty-menu">No menu items available.</div>
        ) : (
          <div className="card-container">
            {itemGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="item-group">
                {group.map((item, index) => {
                  const scale = index === currentIndex % group.length ? 1.2 : 1;

                  return (
                    <animated.div
                      className="card"
                      style={{ transform: `scale(${scale})` }}
                      key={item._id}
                    >
                      <img
                        className="food-image"
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "path/to/placeholder-image.jpg"; // Fallback image
                        }}
                      />
                      <div className="content">
                        <h3>{item.name}</h3>
                        <p>${item.price.toFixed(2)}</p>
                        
                      </div>
                    </animated.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {foodItems.length > 1 && (
          <>
            <button
              className="carousel-button"
              onClick={prev}
              aria-label="Previous item"
            >
              Previous
            </button>
            <button
              className="carousel-button"
              onClick={next}
              aria-label="Next item"
            >
              Next
            </button>
          </>
        )}
      </div>
      <div className="qr-code-generator">
      <h2>QR Code Generator</h2>
      <input
        type="number"
        placeholder="Enter Number of Tables"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        min="1"
        aria-label="Number of tables"
      />
      <button onClick={handleGenerate} aria-label="Generate QR Codes">
        Generate QR Codes
      </button>

      <div className="qr-codes">
        {generatedCodes.map((code, index) => (
          <div key={index} className="qr-code">
            <QRCode value={code} />
            <p>Serial: {index + 1}</p>
            <button onClick={() => handleCopy(code)} aria-label={`Copy URL for serial ${index + 1}`}>
              Copy URL
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FoodMenu;
