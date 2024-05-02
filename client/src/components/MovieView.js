import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { useMovieContext } from "../contexts/MovieContext";
import { useFetchUserData } from "../hooks/useFetchUserData";
import CircularProgress from "@mui/material/CircularProgress";

function MovieView({ movieInfo, toggleOverlay }) {
  const { getToken } = useAuth();
  const [rating, setRating] = useState(movieInfo.userRating);
  const [inWatched, setInWatched] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(false);
  const [status, setStatus] = useState("");
  const { addToList, removeFromList, updateMovieRating } = useMovieContext();
  // const [errorMessage, setErrorMessage] = useState("");

  const userData = useFetchUserData();

  const resetRating = () => {
    setRating(0);
  };

  useEffect(() => {
    if (userData) {
      const checkMovieInList = () => {
        if (getToken()) {
          const usersWatched = userData.movieData.watchedMovies;
          const usersWatchLater = userData.movieData.watchLaterList;
          const movieInWatched = usersWatched.find(
            (movie) => movie.movieId === movieInfo.movieId
          );
          if (movieInWatched !== undefined) {
            setInWatched(true);
            setStatus("Watched");
            setRating(movieInWatched.userRating);
          } else {
            const movieInWatchLater = usersWatchLater.find(
              (movie) => movie.movieId === movieInfo.movieId
            );
            if (movieInWatchLater !== undefined) {
              setInWatchLater(true);
              setStatus("Watch Later");
            }
          }
        }
      };
      checkMovieInList();
      console.log("ran side effect");
    }
  }, [movieInfo, getToken, userData]);

  const buttonsWatched = () => {
    if (inWatched) {
      return (
        <button
          className="button"
          onClick={() => {
            removeFromList(status, movieInfo);
            setInWatched(false);
            setStatus("Not in List");
            resetRating();
          }}
        >
          Remove from Watched
        </button>
      );
    } else {
      return (
        <button
          className="button"
          onClick={() => {
            addToList("watch", movieInfo);
            setStatus("Watched");
            setInWatchLater(false);
            setInWatched(true);
          }}
        >
          Add to Watched
        </button>
      );
    }
  };

  const buttonsWatchLater = () => {
    if (inWatchLater) {
      return (
        <button
          className="button"
          onClick={() => {
            removeFromList(status, movieInfo);
            setInWatchLater(false);
            setStatus("Not in List");
          }}
        >
          Remove from Watch Later
        </button>
      );
    } else {
      return (
        <button
          className="button"
          onClick={() => {
            addToList("watch-later", movieInfo);
            setStatus("Watch Later");
            setInWatchLater(true);
            setInWatched(false);
            resetRating();
          }}
        >
          Add to Watch Later
        </button>
      );
    }
  };

  return (
    <>
      <div id="movie-view-page">
        <img
          src={movieInfo.coverImage}
          alt="movie cover"
          id="movie-view-image"
        />
        <div id="movie-view-title-overview" className="text-container">
          <p id="movie-view-title" className="movie-text">
            {movieInfo.title}
          </p>
          <p id="movie-overview" className="movie-text">
            {movieInfo.overview}
          </p>
          <div id="other-movie-information" className="text-container">
            <p id="movie-genres" className="movie-text">
              <strong className="movie-metadata">Genres:</strong>{" "}
              {movieInfo.genreNames}
            </p>
            <p id="movie-average-rating" className="movie-text">
              <strong className="movie-metadata">Average Rating:</strong>{" "}
              {movieInfo.averageRating !== "NULL"
                ? parseFloat(movieInfo.averageRating.toFixed(1))
                : "DNE"}
            </p>
            <p id="movie-release-date" className="movie-text">
              <strong className="movie-metadata">Release Date:</strong>{" "}
              {movieInfo.releaseDate}
            </p>
            {getToken() && (
              <div id="movie-user-rating" className="movie-text">
                <label id="movie-rating-label" className="movie-metadata">
                  Your Rating:
                </label>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  sx={{
                    "& .MuiRating-icon": {
                      color: "white",
                    },
                  }}
                  onChange={(event, newRating) => {
                    setRating(newRating);
                    updateMovieRating(newRating, movieInfo, resetRating);
                  }}
                />
              </div>
            )}
          </div>
          <p id="movie-status" className="movie-text">
            {status === "" ? "Not in List" : status}
          </p>
        </div>
        <div id="close-button-div" onClick={toggleOverlay}>
          <CloseFullscreenIcon fontSize="large" />
        </div>
        {getToken() ? (
          <div id="edit-button-group" className="button-group">
            {userData ? buttonsWatched() : <CircularProgress color="inherit" />}
            {userData ? (
              buttonsWatchLater()
            ) : (
              <CircularProgress color="inherit" />
            )}
          </div>
        ) : (
          <p id="guest-list-msg" className="guest-msg">
            Create an account to add to list.
          </p>
        )}
      </div>
      <div className="overlay" onClick={toggleOverlay}></div>
    </>
  );
}

export default MovieView;
