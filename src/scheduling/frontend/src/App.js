import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './route/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentSlotPage from './pages/AppointmentSlotPage';
import AppointmentSlotFormPage from './components/AppointmentSlotFormPage';
import AppointmentWrapper from './components/AppointmentWrapper';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes*/}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<SignInPage />} />
          {/* Protected Routes */}
             
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AppointmentSlotPage /></ProtectedRoute>} />
          <Route path="/appointmentSlot/create" element={<ProtectedRoute><AppointmentSlotFormPage /></ProtectedRoute>} />
          <Route path="/appointmentSlot/:id/edit" element={<ProtectedRoute><AppointmentSlotFormPage /></ProtectedRoute>} />
          <Route path="/appointment/Create" element={<ProtectedRoute><AppointmentWrapper /></ProtectedRoute>} />
              
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
