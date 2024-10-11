import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PasswordEntry from './components/PasswordEntry';
import GuestRegistrationForm from './components/GuestRegistrationForm';
import HomePage from './components/HomePage';
import RSVP from './components/RSVP';
import SongSelection from './components/SongSelection';
import Memories from './components/Memories';

const App = () => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordEntry />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <GuestRegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rsvp"
          element={
            <ProtectedRoute>
              <RSVP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/song-selection"
          element={
            <ProtectedRoute>
              <SongSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memories"
          element={
            <ProtectedRoute>
              <Memories />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default App;