import React, { createContext, useCallback, useContext } from "react";

// Create the context with a default undefined value
const AuthContext = createContext(undefined);

// AuthProvider component that will wrap your app or part of it
export const AuthProvider = ({ children }) => {
  // Define the functions to handle login, logout, and guest user
  const handleLogin = (username, token) => {
    const userSession = {
      name: username,
      token: token,
    };
    localStorage.setItem("userSession", JSON.stringify(userSession));
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("userData");
  };

  // Function to get the user's username from localStorage
  const getUsername = () => {
    const userString = localStorage.getItem("userSession");
    if (userString) {
      const userObject = JSON.parse(userString);
      const username = userObject.name;
      return username;
    }

    return null;
  };

  // Function to get the user's token from localStorage
  const getToken = useCallback(() => {
    const userString = localStorage.getItem("userSession");
    if (userString) {
      const userObject = JSON.parse(userString);
      const token = userObject.token;
      return token;
    }

    return null;
  }, []);

  const getUserMovieData = () => {
    const userString = localStorage.getItem("userData");
    if (userString) {
      const userObject = JSON.parse(userString);
      const movieData = userObject.movieData;
      return movieData;
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleLogout,
        getToken,
        getUsername,
        getUserMovieData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
