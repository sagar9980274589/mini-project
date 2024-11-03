import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 
import './RestaurantApp.css';

function RestaurantApp() {
  const [restaurantName, setRestaurantName] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // State for user email
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email); // Store the email in state

        const response = await axios.get(`http://localhost:5000/api/menuItems?userEmail=${decodedToken.email}`);
        setMenuItems(response.data);
      } catch (error) {
        setError("Error fetching menu items.");
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMenuItems();
  }, []);
  
  const handleRestaurantNameChange = (e) => {
    setRestaurantName(e.target.value);
  };

  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const isPriceValid = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
  };

  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.imageUrl || !isPriceValid(newMenuItem.price)) {
      setError("Please fill in all fields with valid data.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token); 
      const response = await axios.post('
        /api/menuItems', {
        ...newMenuItem,
        userEmail: decodedToken.email,
      });
      setMenuItems((prev) => [...prev, response.data]);
      setNewMenuItem({ name: '', price: '', imageUrl: '' });
    } catch (error) {
      setError("Error adding menu item. Please try again.");
      console.error("Error adding menu item:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/menuItems/${id}`);
      setMenuItems((prev) => prev.filter(item => item._id !== id));
    } catch (error) {
      setError("Error deleting menu item. Please try again.");
      console.error("Error deleting menu item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to the login page
  };

  const handleGetMenu = () => {
    navigate(`/foodmenu/${userEmail}`); // Redirect to FoodMenu with userEmail
  };

  return (
    <div className="restaurant-app">
      <h1>Create Your E-Restaurant</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h2>Logged in as: {userEmail}</h2> {/* Display user email */}
      <input
        type="text"
        placeholder="Enter Restaurant Name"
        value={restaurantName}
        onChange={handleRestaurantNameChange}
      />
      <h2>Menu for {restaurantName}</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="menu-form">
        <input
          type="text"
          name="name"
          placeholder="Menu Item Name"
          value={newMenuItem.name}
          onChange={handleMenuItemChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Menu Item Price"
          value={newMenuItem.price}
          onChange={handleMenuItemChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newMenuItem.imageUrl}
          onChange={handleMenuItemChange}
        />
        <button onClick={addMenuItem}>Add Menu Item</button>
      </div>
      <div className="menubox">
        {menuItems.map((item) => (
          <div key={item._id} className='fooditems'>
            {item.imageUrl && <img className='foodimage' src={item.imageUrl} alt={item.name} />}
            <span>{item.name} - ${item.price}</span>
            <button onClick={() => deleteMenuItem(item._id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={handleGetMenu} className="get-menu-button">
        GET MENU
      </button> {/* GET MENU button */}
    </div>
  );
}

export default RestaurantApp;
