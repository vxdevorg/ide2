import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';

// Existing pages
import Home from './route/Home';
import ScreenReaderNVDA from './pages/ScreenReaderNVDA';
import AdminLogin from './pages/admin/AdminLogin.';
import JudgeLogin from './pages/judge/JudgeLogin';
import JudgeDashboard from './pages/judge/JudgeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWinnerDashboard from "./pages/admin/AdminWinnerDashboard.jsx";
//import AdminWinnerLogin from "./pages/admin/AdminWinnerLogin.jsx";

// Categorizer pages
import CategorizerLogin from './pages/categorizer/CategorizerLogin';
import CategorizerDashboard from './pages/categorizer/CategorizerDashboard';

// Protected Routes
const ProtectedWinnerRoute = ({ children }) => {
  const isWinnerAuth = localStorage.getItem("adminWinnerAuth") === "true";
  const isAdminAuth = localStorage.getItem("adminAuth") === "true";

  // Allow access if either:
  // 1. Already authenticated for winner panel, OR
  // 2. Coming from admin dashboard (admin is authenticated)
  if (!isWinnerAuth && !isAdminAuth) {
    window.location.href = "/admin"; // Redirect to admin login
    return null;
  }

  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem("adminAuth") === "true";
  if (!isAdminAuth) {
    window.location.href = "/admin";
    return null;
  }
  return children;
};

const ProtectedJudgeRoute = ({ children }) => {
  const isJudgeAuth = localStorage.getItem("judgeAuth") === "true";
  if (!isJudgeAuth) {
    window.location.href = "/judge";
    return null;
  }
  return children;
};

const ProtectedCategorizerRoute = ({ children }) => {
  const isCategorizerAuth = localStorage.getItem("categorizerAuth") === "true";
  if (!isCategorizerAuth) {
    window.location.href = "/categorizer";
    return null;
  }
  return children;
};

const App = () => {
  const location = useLocation();

  // Hide navbar for admin/judge screens
  const hideNavbarRoutes = [
    "/admin",
    "/judge",
    "/judgedashboard",
    "/admindashboard",
    "/adminwinner",
    "/adminwinner-login",
    "/categorizer",
    "/categorizer/dashboard"
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const [language, setLanguage] = useState("English");
  const [themeColor, setThemeColor] = useState("#0868CC");

  const commonProps = {
    language,
    setLanguage,
    themeColor,
    setThemeColor,
  };

  return (
    <div className="overflow-hidden">
      {!hideNavbar && <Navbar {...commonProps} />}

      <Routes>
        <Route path="/" element={<Home {...commonProps} />} />
        <Route path="/NVDA" element={<ScreenReaderNVDA {...commonProps} />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admindashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/adminwinner"
          element={
            <ProtectedWinnerRoute>
              <AdminWinnerDashboard />
            </ProtectedWinnerRoute>
          }
        />

        {/* Judge */}
        <Route path="/judge" element={<JudgeLogin />} />
        <Route
          path="/judgedashboard"
          element={
            <ProtectedJudgeRoute>
              <JudgeDashboard />
            </ProtectedJudgeRoute>
          }
        />

        {/* Categorizer */}
        <Route path="/categorizer" element={<CategorizerLogin />} />
        <Route
          path="/categorizer/dashboard"
          element={
            <ProtectedCategorizerRoute>
              <CategorizerDashboard />
            </ProtectedCategorizerRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;