import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Dropdown from "./Dropdown";

function Layout() {
  const navigate = useNavigate();
  const { getToken, getUsername, handleLogout } = useAuth();
  // State to manage visibility of dropdown menu for user profile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const username = getUsername();

  // Helper function to route to Login page
  const routeToLogin = () => {
    navigate("/login");
  };

  // Function for logging out the user
  const logoutUser = () => {
    handleLogout();
    routeToLogin();
  };

  return (
    <div className="app">
      <div id="header-container" className="section-container">
        <div className="sub-header-container">
          <h1
            id="title"
            onClick={() => {
              navigate("/");
            }}
          >
            MyMovieList
          </h1>

          {getToken() ? (
            <div className="dropdown">
              <button
                id="profile-btn"
                className="button"
                onClick={toggleDropdown}
              >
                {username}
              </button>
              {isDropdownOpen && (
                <Dropdown toggle={toggleDropdown} logout={logoutUser} />
              )}
            </div>
          ) : (
            <button id="login-button" className="button" onClick={routeToLogin}>
              Login
            </button>
          )}
        </div>
        <Navbar />
      </div>
      <main className="page">
        <Outlet />
      </main>
      <footer>
        <div id="footer-socials" className="footer-container">
          <span className="social-icon">
            <InstagramIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <FacebookIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <XIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <GitHubIcon fontSize="large" />
          </span>
        </div>
        <div id="footer-navbar" className="footer-container">
          <Navbar />
        </div>
        <div id="footer-copyright" className="footer-container">
          <p id="footer-title">
            MyMovieList <span id="copyright">&copy; 2024</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
