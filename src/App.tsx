import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PasswordEntry from './components/PasswordEntry';
import Home from './components/Home';
import GuestRegistrationForm from './components/GuestRegistrationForm';

export default function App() {
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
              <GuestRegisteredRoute>
                <Home />
              </GuestRegisteredRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function GuestRegisteredRoute({ children }: ProtectedRouteProps) {
  const isGuestRegistered = localStorage.getItem('isGuestRegistered') === 'true';
  return isGuestRegistered ? <>{children}</> : <Navigate to="/register" replace />;
}