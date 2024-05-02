function HeroMovies({ movies }) {
  return (
    <div className="hero-images">
      <div id="dune" className="listed-movie-card">
        <img
          className="hero-image"
          src={movies[0].coverImage}
          alt="movie cover"
        />
        <p className="movie-user-status">Watched</p>
      </div>
      <div id="kfp" className="listed-movie-card">
        <img
          className="hero-image"
          src={movies[1].coverImage}
          alt="movie cover"
        />
        <p className="movie-user-status">Watch Later</p>
      </div>
      <div id="immaculate" className="listed-movie-card">
        <img
          className="hero-image"
          src={movies[2].coverImage}
          alt="movie cover"
        />
        <p className="movie-user-status">Watch Later</p>
      </div>
    </div>
  );
}

export default HeroMovies;
