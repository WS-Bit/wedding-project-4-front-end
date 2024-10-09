import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PasswordEntry from './components/PasswordEntry';
import Home from './components/Home';
import GuestRegistrationForm from './components/GuestRegistrationForm';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ?
              <Navigate to="/register" /> :
              <PasswordEntry setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <GuestRegistrationForm /> : <Navigate to="/" />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}