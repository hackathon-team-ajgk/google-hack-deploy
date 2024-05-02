import React, { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// Create the context with a default undefined value
const MovieContext = createContext(undefined);

// MovieProvider component that will wrap your app or part of it
export const MovieProvider = ({ children }) => {
  const { getToken, getUsername } = useAuth();

  const updateMovieRating = async (movieRating, movieInfo, resetRating) => {
    try {
      const token = getToken();
      const username = getUsername();
      const response = await axios.put(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/update-user-rating",
        {
          username: username,
          movieTitle: movieInfo.title,
          userRating: movieRating,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        window.alert(
          "The movie is not in your watched list. Please add it to your list of watched movies first."
        );
        resetRating();
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const addToList = async (action, movieInfo) => {
    try {
      const username = getUsername();
      const token = getToken();

      const response = await axios.put(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/edit-movie-state",
        {
          username: username,
          action: action,
          movie: movieInfo,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // setErrorMessage("You must be a user to add to list.");
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const removeFromList = async (movieStatus, movieInfo) => {
    try {
      const username = getUsername();
      const token = getToken();
      const response = await axios.put(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/remove-movie",
        {
          username: username,
          movieName: movieInfo.title,
          status: movieStatus,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <MovieContext.Provider
      value={{
        addToList,
        removeFromList,
        updateMovieRating,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the auth context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within an MovieProvider");
  }
  return context;
};
