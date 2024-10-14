import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import PasswordEntry from './components/PasswordEntry';
import GuestRegistrationForm from './components/GuestRegistrationForm';
import HomePage from './components/HomePage';
import RSVP from './components/RSVP';
import SongSelection from './components/SongSelection';
import Memories from './components/Memories';
import FAQ from './components/FAQ';
import Accommodation from './components/Accommodation';
import { fetchCsrfToken } from './services/api';

const App = () => {

  useEffect(() => {
    fetchCsrfToken().catch(console.error);
  }, []);

  
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <ThemeProvider>
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
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accommodation"
            element={
              <ProtectedRoute>
                <Accommodation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
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