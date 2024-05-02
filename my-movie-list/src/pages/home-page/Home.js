import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import HeroMovies from "../../components/HeroMovies";
import MovieSlider from "../../components/MovieSlider";
import { useAuth } from "../../contexts/AuthContext";
import { Reveal } from "../../components/Reveal";

function Home() {
  const { getToken } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);

  const navigate = useNavigate();

  const storeTrendingMovies = (movies) => {
    setTrendingMovies(movies);
  };

  const getHeroMovies = useCallback(() => {
    const firstThreeMovies = trendingMovies.slice(0, 3);
    setHeroMovies(firstThreeMovies);
  }, [trendingMovies]);

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const response = await axios.get(
          "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/getTrendingMovies"
        );
        const movies = response.data.movie;
        storeTrendingMovies(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code not within 2xx
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
    if (trendingMovies.length > 0) {
      getHeroMovies();
    }
  }, [trendingMovies, getHeroMovies]);

  return (
    <div className="sub-page">
      <Reveal>
        <section id="hero-section" className="section-container">
          <div id="text-container">
            <p className="hero-section-text">
              Save your favourite movies and create your own personalized movie
              list so that you always know what to watch next!
            </p>
            <p id="bold-hero-text" className="hero-section-text">
              Create your Movie List today.
            </p>
            <button
              id="hero-button"
              className="home-button"
              onClick={() => {
                navigate("/your-list");
              }}
            >
              Your Movie List
            </button>
          </div>
          <div id="hero-movie-images" className="images">
            {heroMovies.length === 3 && <HeroMovies movies={heroMovies} />}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <MovieSlider genre="Trending" movies={trendingMovies} />
      </Reveal>
      <Reveal>
        <section id="ai-suggestions" className="section-container">
          <div id="ai-sugg-text-container">
            <strong id="ai-sugg-main-text" className="home-text">
              Can't think of what movie to watch next?
            </strong>
            <p id="ai-sugg-secondary-text" className="home-text">
              Use <strong>Google’s AI Gemini</strong> to generate movie
              suggestions based on a genre or your list!
            </p>
            <p className="home-text">
              Go to our movies page and select a genre from the dropdown then
              get Gemini's movie recommendations based on the chosen genre.{" "}
            </p>
            <p className="home-text">
              <strong>Or even better,</strong> add to your movie list today and
              get personalized recommendations based on movies you've watched or
              will be watching soon!
            </p>
          </div>
        </section>
      </Reveal>
      <Reveal>
        {!getToken() && (
          <section id="cta" className="section-container">
            <div id="cta-div">
              <strong id="cta-title" className="cta-text">
                Create an Account Today!
              </strong>
              <p className="cta-text">
                Join the community and start adding to your own movie list
                today. Always have something to watch next and an AI tool that
                gives you suggestions if you're still not sure!
              </p>
              <button
                className="home-button"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register Now
              </button>
            </div>
          </section>
        )}
      </Reveal>
    </div>
  );
}

export default Home;
