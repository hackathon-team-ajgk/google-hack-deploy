import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Dropdown from "./Dropdown";
import { Toaster } from "sonner";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
      <Toaster position="top-center" />
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
                <span className="account-icon">
                  <AccountCircleIcon />
                </span>
                <span className="account-name">{username}</span>
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
          <a
            className="link-tree"
            target="_blank"
            rel="noreferrer"
            href="https://linktr.ee/MyMovieListDevs"
          >
            <span className="link-tree-icon">
              <OpenInNewIcon fontSize="small" />
            </span>
            Linktree
          </a>
        </div>
        <div id="footer-navbar" className="footer-container">
          <Navbar display="flex" />
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
