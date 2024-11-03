import React from 'react';
import './Welcomepage.css';
import { Link, useParams } from 'react-router-dom';

function Welcomepage() {
  let { usrId } = useParams();
console.log(usrId);
  return (
    <div className="welcome-container">
      <h1 className="welcome-text">
        {usrId ? `Welcome Boss ${usrId}, create your E-Restaurant` : "Welcome Boss, create your E-Restaurant"}
      </h1>
      <Link to={`/createERestaurant/${usrId}`}>
        <button className="create-button">Create E-Restaurant</button>
      </Link>
    </div>
  );
}

export default Welcomepage;
