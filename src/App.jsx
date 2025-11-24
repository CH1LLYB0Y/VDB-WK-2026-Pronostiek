import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Pronostiek from "./pages/Pronostiek";
import Klassement from "./pages/Klassement";
import Admin from "./pages/Admin";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Header from "./components/Header";

import "./index.css";

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

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
    </Router>
  );
}
