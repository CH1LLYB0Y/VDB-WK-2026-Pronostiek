// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; // Zet dit in Vercel

  function handleLogin(e) {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
    } else {
      alert('Fout wachtwoord');
    }
  }

  return (
    <Router>
      <Routes>
        {/* Hoofdpagina voor familie */}
        <Route path="/" element={<Home />} />

        {/* Admin pagina met simpele login */}
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <Admin />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-2 w-full max-w-xs">
                  <input
                    type="password"
                    placeholder="Admin wachtwoord"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Login
                  </button>
                </form>
              </div>
            )
          }
        />

        {/* Redirect naar home als onbekende route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
