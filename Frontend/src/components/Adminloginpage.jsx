import React, { useState } from 'react';
import './Adminloginpage.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api'; // Importing the API function
import { useAuth } from '../AuthContext';

function Adminloginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

 const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    const response = await loginUser({ email, password });
    login(response.token);
    navigate(`/welcome/${email}`);
  } catch (error) {
    console.error(error);
    setError("Invalid email or password");
  }
};

  

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img 
              src="https://marketplace.canva.com/EAFpeiTrl4c/1/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-9Gfim1S8fHg.jpg"
              className="img-fluid" alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleLogin}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                {/* Social login buttons */}
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Or</p>
              </div>

              <div className="form-outline mb-4">
                <input 
                  type="email" 
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="form-label">Email address</label>
              </div>

              <div className="form-outline mb-3">
                <input 
                  type="password" 
                  className="form-control form-control-lg"
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="form-label">Password</label>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="text-center text-lg-start mt-4 pt-2">
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Login
                </button>
                
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account? <Link to="/register" className="link-danger">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
    </section>
  );
}

export default Adminloginpage;
