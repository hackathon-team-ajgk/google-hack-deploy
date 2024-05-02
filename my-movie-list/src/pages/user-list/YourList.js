import "./YourList.css";
import MovieSlider from "../../components/MovieSlider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

function YourList() {
  const { getToken, getUsername } = useAuth();

  const [watched, setWatched] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [suggestionsByList, setSuggestionsByList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserRecommendationsByList = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await axios.get(
        "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/getRecommendations-list",
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
      setSuggestionsByList(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Get Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getUserMovieData = async () => {
      try {
        const token = getToken();
        const username = getUsername();
        const response = await axios.get(
          "https://google-hackathon-dbr4l55rs-aejgk.vercel.app/getUserMovieData",
          {
            headers: {
              authorization: token,
            },
            params: {
              username: username,
            },
          }
        );
        setWatchLater(response.data.watchLaterList);
        setWatched(response.data.watchedMovies);
      } catch (error) {
        if (error.response) {
          // The server responded with a status code that falls out of the range of 2xx
          console.error("Get Error:", error.response.data);
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
    getUserMovieData();
  }, [getToken, getUsername]);

  return (
    <div className="sub-page">
      {getToken() ? (
        <>
          <MovieSlider
            genre="Watched"
            movies={watched}
            isList={true}
            isEmpty={watched.length === 0}
          />
          <MovieSlider
            genre="Watch Later"
            movies={watchLater}
            isList={true}
            isEmpty={watchLater.length === 0}
          />

          {suggestionsByList.length > 0 && (
            <MovieSlider
              genre="Recommendations From List"
              movies={suggestionsByList}
            />
          )}
          {isLoading ? (
            <CircularProgress color="inherit" />
          ) : (
            <button
              id="generate-recs-list"
              className="button"
              onClick={getUserRecommendationsByList}
            >
              Get Recommendations
            </button>
          )}
        </>
      ) : (
        <h1 id="guest-msg">You must be a user to have a list.</h1>
      )}
    </div>
  );
}

export default YourList;
