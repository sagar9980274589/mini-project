import React, { createContext, useContext, useState } from 'react';

// Create the context
const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
  const [readyOrders, setReadyOrders] = useState([]);

  const addReadyOrder = (orderId, serialNumber) => {
    setReadyOrders((prevOrders) => [...prevOrders, { orderId, serialNumber }]);
  };

  const clearReadyOrders = () => {
    setReadyOrders([]);
  };

  return (
    <OrderContext.Provider value={{ readyOrders, addReadyOrder, clearReadyOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
