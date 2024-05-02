import "../pages/home-page/Home.css";
import { useState } from "react";
import MovieView from "./MovieView";
import { MovieProvider } from "../contexts/MovieContext";

function MovieCard({ movie }) {
  const [overlayOn, setOverlayOn] = useState(false);

  // Function to toggle overlay visibility
  const toggleOverlay = () => {
    if (overlayOn) {
      window.location.reload();
    }
    setOverlayOn(!overlayOn);
  };

  return (
    <>
      {movie && (
        <div className="movie-card" onClick={toggleOverlay}>
          <img
            className="movie-image"
            src={movie.coverImage}
            alt="movie cover"
          />
          <p className="movie-title">
            {movie.title.length > 40
              ? movie.title.slice(0, 40) + "..."
              : movie.title}
          </p>
        </div>
      )}
      {overlayOn && (
        <MovieProvider>
          <MovieView movieInfo={movie} toggleOverlay={toggleOverlay} />
        </MovieProvider>
      )}
    </>
  );
}

export default MovieCard;
