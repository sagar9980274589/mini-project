import React, { useState } from 'react';
import './Adminloginpage.css'; // Import the same CSS file for consistent styling
import { registerUser } from '../api'; // Importing the API function
import { useNavigate,Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    try {
      await registerUser({ username, email, password }); // Call API to register
      navigate('/'); // Redirect after successful registration
    } catch (error) {
      setError(error.response?.data?.error || "Error registering user"); // Improved error handling
    } finally {
      setLoading(false); // Reset loading state
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
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <div className="form-outline mb-4">
                <input 
                  type="text" 
                  className="form-control form-control-lg"
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
                <label className="form-label">Username</label>
              </div>
              <div className="form-outline mb-4">
                <input 
                  type="email" 
                  className="form-control form-control-lg"
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <label className="form-label">Email</label>
              </div>
              <div className="form-outline mb-3">
                <input 
                  type="password" 
                  className="form-control form-control-lg"
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <label className="form-label">Password</label>
              </div>
              {error && <div className="error">{error}</div>}
              <div className="text-center text-lg-start mt-4 pt-2">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Already have an account? <Link to="/" className="link-danger">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer (if needed) */}
    </section>
  );
}

export default RegisterPage;
