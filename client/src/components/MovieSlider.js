import MovieCard from "./MovieCard";
import { useId } from "react";

function MovieSlider({ movies, genre, isList }) {
  const movieSliderId = useId();

  return (
    <div id={`slider-${movieSliderId}`} className="movie-slider-container">
      <p className="movie-label">{genre}</p>
      {isList && movies.length === 0 && (
        <h3 className="empty-list-msg">Your List is Empty</h3>
      )}
      <section className="movie-slider">
        {movies.map((val, key) => (
          <MovieCard key={`${genre}-${key}`} movie={val} />
        ))}
      </section>
    </div>
  );
}

export default MovieSlider;
