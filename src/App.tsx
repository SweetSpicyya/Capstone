import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';

const HomePlaceholder = () => <div style={{ padding: 20 }}>Home Page (Coming soon)</div>;
const LoginPlaceholder = () => <div style={{ padding: 20 }}>Login Page (Coming soon)</div>;

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;