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
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<PasswordEntry />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <GuestRegistrationForm />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <HomePage />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rsvp"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <RSVP />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/song-selection"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <SongSelection />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/memories"
            element={
              <ProtectedRoute>
                <div className="flex justify-center items-start">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Memories />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
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