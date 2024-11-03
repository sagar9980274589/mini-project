import React from 'react';
import { useAuth } from './AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic here, e.g., check credentials
    login(); // Update auth context state
    navigate('/welcome'); // Redirect to the welcome page
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default LoginPage;
