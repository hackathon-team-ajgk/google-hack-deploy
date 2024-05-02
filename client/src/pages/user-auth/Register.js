import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/register",
        userData
      );
      console.log("Registration Successful", response.data);
      // Handle successful registration, perhaps redirect or clear form
      nav("/login");
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Registration Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        window.alert("User already exists in database.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Registration Request Error:", error.request);
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
      movieData: {
        watchedMovies: [],
        watchLaterList: [],
      },
      bio: "",
    };
    if (confirmPassword !== password) {
      setMessage("Your password is not the same. Please try again");
    } else {
      registerUser(credentials);
    }
  };

  return (
    <div className="auth-page">
      <h1 id="register-title">Register</h1>
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
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="Enter Username"
          autoComplete="username"
          required
        />
        <label className="form-label" htmlFor="password-field">
          Password:
        </label>
        <input
          id="password-field"
          className="form-input"
          type="password"
          onChange={(e) => {
            console.log(e.target.value);
            setPassword(e.target.value);
          }}
          value={password}
          placeholder="Enter Password"
          title="Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          autoComplete="new-password"
          required
        />

        <label className="form-label" htmlFor="password-field">
          Re-enter Password:
        </label>
        <input
          // id="password-field"
          className="form-input"
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          value={confirmPassword}
          placeholder="Enter Password"
          title=""
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          autoComplete="new-password"
          required
        />

        <button
          id="register-submit-button"
          className="submit-button"
          type="submit"
        >
          Register
        </button>
        <div className="user-auth-button-group">
          <Link id="guest-link" className="link" to="/">
            Continue as Guest
          </Link>
          <Link className="link" to="/login">
            Already a user? Login here!
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
