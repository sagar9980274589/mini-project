
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Adminloginpage from './components/Adminloginpage';
import Welcomepage from './components/Welcomepage';
import RestaurantApp from './components/RestaurantApp'
import FoodMenu from './components/FoodMenu'
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import RegisterPage from './components/RegisterPage';
import DisplayMenu from './components/DisplayMenu';
import Admin from './components/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Adminloginpage />} />
          <Route 
            path="/welcome/:email" 
            element={
              <ProtectedRoute>
                <Welcomepage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/createERestaurant/:usrId" element={ <ProtectedRoute><RestaurantApp/></ProtectedRoute> } />
          <Route path="/displaymenu/:userEmail" element={<DisplayMenu />} />
        <Route path="/admin/:adminId" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
   <Route path="/foodmenu/:email" element={  <ProtectedRoute><FoodMenu/></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
