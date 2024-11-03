import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this if your backend is hosted elsewhere

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Return the response data, typically success message
  } catch (error) {
    // Handle error and provide meaningful feedback
    if (error.response) {
      throw new Error(error.response.data.error || "Registration failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// Function to log in a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data; // Return the token or user data
  } catch (error) {
    // Handle error and provide meaningful feedback
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};

// Function to log out a user (optional, as this might just be a front-end action)
export const logoutUser = async () => {
  // Handle logout logic here if needed
  return { message: 'Logged out' };
};

// Optional: Function to fetch user data if needed
export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: token },
    });
    return response.data; // Return the user data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch user data");
    } else {
      throw new Error("Network error, please try again");
    }
  }
};
