const geminiAPI = require("../services/geminiApiHandler");
const movieAPI = require("../services/movieApiHandler");

module.exports = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ error: "Genre must be specified" });
    }

    // Get movie suggestions based on the genre
    const movieSuggestions = await geminiAPI.giveMovieSuggestionsBasedOnGenre(
      genre
    );
    const movieMetadata = [];

    for (const movie of movieSuggestions) {
      if (movie === "") continue;
      const formattedMovie = await movieAPI.searchForMovieFromGemini(movie);
      movieMetadata.push(formattedMovie);
    }

    res.status(200).json(movieMetadata);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
