import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { handleLogin } = useAuth();
  const nav = useNavigate();

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/login",
        credentials
      );

      // Handle successful login, such as storing auth tokens, redirecting, etc.
      handleLogin(username, response.data);
      nav("/");
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Login Error:", error.response.data);
        setMessage("Incorrect Password/Username. Please try again");
        // window.alert("Username or Password is Incorrect");
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Login Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from submitting normally
    const credentials = {
      username: username,
      password: password,
    };
    loginUser(credentials);
  };

  return (
    <div className="auth-page">
      <h1 id="login-title">Login</h1>
      <form className="user-auth-form" onSubmit={handleSubmit}>
        {message !== "" && (
          <p style={{ color: message.includes("") ? "darkred" : "green" }}>
            {message}
          </p>
        )}
        <label className="form-label" htmlFor="username-field">
          Username:
        </label>
        <input
          id="username-field"
          className="form-input"
          autoComplete="username"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />
        <label className="form-label" htmlFor="password-field">
          Password:
        </label>
        <input
          id="password-field"
          className="form-input"
          type="password"
          autoComplete="current-password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <button
          id="login-submit-button"
          className="submit-button"
          type="submit"
        >
          Login
        </button>
        <div className="user-auth-button-group">
          <Link id="guest-link" className="link" to="/">
            Continue as Guest
          </Link>
          <Link className="link" to="/register">
            Not a user? Register here!
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
