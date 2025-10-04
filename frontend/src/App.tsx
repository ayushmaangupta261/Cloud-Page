import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {AuthPage} from './pages/AuthPage';
import SplashScreen from './pages/SplashScreen';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './component/auth/ProtectedRoute';
import UnProtectedRoute from './component/auth/UnProtectedRoute';


import Navbar from './component/Navigation/Navbar';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <div className="overflow-hidden relative">

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[80%] z-50">
        <Navbar />
      </div>

      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route 
          path="/" 
          element={
            <UnProtectedRoute>
              <SplashScreen />
            </UnProtectedRoute>
          } 
        />

        <Route 
          path="/authPage" 
          element={
            <UnProtectedRoute>
              <AuthPage />
            </UnProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
