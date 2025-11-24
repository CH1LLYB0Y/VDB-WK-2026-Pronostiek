import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Pronostiek from "./pages/Pronostiek";
import Klassement from "./pages/Klassement";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-lightGray font-aptos">

        <header className="bg-darkBlue text-white shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

            {/* Logo vanuit public/ */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png"
                alt="WK 2026 Logo"
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h1 className="text-xl font-bold leading-5 group-hover:text-green transition-colors">
                  VDB WK 2026
                </h1>
                <p className="text-sm opacity-80">Pronostiek</p>
              </div>
            </Link>

            <nav className="flex gap-6 text-lg">
              <Link to="/pronostiek" className="hover:text-green transition-colors">
                Pronostiek
              </Link>

              <Link to="/klassement" className="hover:text-green transition-colors">
                Klassement
              </Link>

              <Link to="/admin" className="hover:text-green transition-colors">
                Admin
              </Link>
            </nav>

          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 mt-4">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route 
              path="/pronostiek" 
              element={
                <ProtectedRoute>
                  <Pronostiek />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/klassement" 
              element={
                <ProtectedRoute>
                  <Klassement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
