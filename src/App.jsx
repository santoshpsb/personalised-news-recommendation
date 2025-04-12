import React, { useState } from "react";
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/NavBar";
import News from "./pages/news_main/News";
import LoadingBar from "react-top-loading-bar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProfilePage from "./pages/profile/Profile";

const AppContent = ({ setProgress, pageSize, isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();

  const showNavbar = location.pathname.startsWith("/news");

  return (
    <>
      {showNavbar && <Navbar isAuthenticated={isAuthenticated}/>}
      <LoadingBar color="#f11946" progress={0} height={2} />

      <Routes>
        {/* Redirect from root to /news/general */}
        <Route path="/" element={<Navigate to="/news/general" />} />

        {/* Public Routes */}
        <Route
          path="/signup"
          element={<Signup setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/profile"
          element={<ProfilePage setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* News Routes */}
        <Route
          path="/news/general"
          element={
            <News
              key="general"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="general"
            />
          }
        />
        <Route
          path="/news/business"
          element={
            <News
              key="business"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="business"
            />
          }
        />
        <Route
          path="/news/entertainment"
          element={
            <News
              key="entertainment"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="entertainment"
            />
          }
        />
        <Route
          path="/news/health"
          element={
            <News
              key="health"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="health"
            />
          }
        />
        <Route
          path="/news/science"
          element={
            <News
              key="science"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="science"
            />
          }
        />
        <Route
          path="/news/sports"
          element={
            <News
              key="sports"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="sports"
            />
          }
        />
        <Route
          path="/news/technology"
          element={
            <News
              key="technology"
              setProgress={setProgress}
              pageSize={pageSize}
              country="us"
              category="technology"
            />
          }
        />

        {/* Catch-all fallback route */}
        <Route path="*" element={<Navigate to="/news/general" />} />
      </Routes>
    </>
  );
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("userEmail"); // Check if the user is already authenticated
  });

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setProgress={setProgress}
        pageSize={10}
      />
    </Router>
  );
}
