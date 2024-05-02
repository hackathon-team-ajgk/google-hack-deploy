import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function SearchMovie({ onSearch }) {
  const [searchedMovie, setSearchedMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovieBySearch();
  };

  const getMovieBySearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/getMoviesFromSearch",
        {
          params: { movie: searchedMovie },
        }
      );
      onSearch(response.data.movie);
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        window.alert(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error:", error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <section id="search-movie-container" className="section-container">
        <div id="search-bar-container">
          <form id="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="search-input"
              placeholder="Search Movie Here"
              onChange={(e) => {
                setSearchedMovie(e.target.value);
              }}
            />

            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <button id="search-submit-btn" className="button" type="submit">
                Search
              </button>
            )}
          </form>
        </div>
      </section>
      {/* {moviesFromSearch.length > 0 && (
        <MovieSlider genre="Search Results" movies={moviesFromSearch} />
      )} */}
    </>
  );
}

export default SearchMovie;
