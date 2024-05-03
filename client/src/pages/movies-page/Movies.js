import "./Movies.css";
import MovieSlider from "../../components/MovieSlider";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchMovie from "../../components/SearchMovie";
import MovieRecs from "../../components/MovieRecs";
import { Reveal } from "../../components/Reveal";

function Movies() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getTrendingMovies`
        );

        const movies = response.data.movie;
        setTrendingMovies(movies);
        console.log(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request Error:", error.request);
        } else {
          // Something else happened while setting up the request
          console.error("Error:", error.message);
        }
      }
    };

    getTrendingMovies();
  }, []);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getPopularMovies`
        );
        const movies = response.data.movie;
        setPopularMovies(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request Error:", error.request);
        } else {
          // Something else happened while setting up the request
          console.error("Error:", error.message);
        }
      }
    };

    getPopularMovies();
  }, []);

  const handleSearch = (searchResult) => {
    setSearchedMovies(searchResult);
  };

  const handleRecommendations = (recommendations) => {
    setRecommendations(recommendations);
  };

  return (
    <div className="sub-page">
      <Reveal width="100%">
        <div className="search-recs-container">
          <MovieRecs onChange={handleRecommendations} />
          <SearchMovie onSearch={handleSearch} />
        </div>
      </Reveal>

      {searchedMovies.length > 0 && (
        <Reveal width="100%">
          <MovieSlider genre="Search Results" movies={searchedMovies} />
        </Reveal>
      )}

      {recommendations.length > 0 && (
        <Reveal width="100%">
          <MovieSlider genre={`Recommendations`} movies={recommendations} />
        </Reveal>
      )}
      <Reveal>
        <MovieSlider genre="Trending" movies={trendingMovies} />
      </Reveal>
      <Reveal>
        <MovieSlider genre="Popular" movies={popularMovies} />
      </Reveal>
    </div>
  );
}

export default Movies;
