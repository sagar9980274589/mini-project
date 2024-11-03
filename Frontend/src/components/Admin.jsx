import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useOrder } from '../OrderContext';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addReadyOrder } = useOrder();
  const token = localStorage.getItem('token');
  const tokenEmail = token ? jwtDecode(token)?.email : '';

  // Check if the logged-in user has permission to view this page
  if (adminId !== tokenEmail) {
    return <div className="error">You do not have permission to view this page.</div>;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!tokenEmail) return; // Ensure the email is available
      try {
        // Fetch orders specific to the logged-in user by email
        const response = await axios.get(`http://localhost:5000/api/orders?userEmail=${tokenEmail}`);
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching orders. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tokenEmail]);

  const handleOrderReady = useCallback(async (orderId, serialNumber) => {
    const confirmReady = window.confirm(`Are you sure you want to mark Order ${orderId} as ready?`);
    if (!confirmReady) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
      addReadyOrder(orderId, serialNumber);
      alert(`Order ${orderId} is marked as ready!`);
    } catch (error) {
      console.error('Error marking order as ready:', error);
      alert('Failed to mark order as ready. Please try again.');
    }
  }, [addReadyOrder]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the login page
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="adminpage">
        <div className="adminhead">
          <h1>Your Orders</h1>
        </div>
        {orders.length === 0 ? (
          <div>No orders available.</div>
        ) : (
          <div className="orders">
            {orders.map(({ orderId, serialNumber, items }) => (
              <div key={orderId} className="order-card">
                <h3>Order ID: {orderId}</h3>
                <p>Serial Number: {serialNumber}</p>
                <h4>Items:</h4>
                <ul>
                  {items.map(({ id, name, quantity, total }, index) => (
                    <li key={id || index}>
                      {name} (x{quantity}) - ${total.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total: ${items.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</strong>
                </p>
                <button onClick={() => handleOrderReady(orderId, serialNumber)} className="ready-button">
                  Mark as Ready
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
