const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");
const geminiAPI = require("../services/geminiApiHandler");
const movieAPI = require("../services/movieApiHandler");

module.exports = async (req, res) => {
  try {
    // Authenticate user and extract username from token
    const userClaims = authenticateToken(req);

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user in the database
    const userInDb = await usersCollection.findOne({
      username: userClaims.username,
    });
    if (!userInDb) {
      return res.status(404).json({ error: "User not found" });
    }

    const movieList = userInDb.movieData;
    console.log(movieList);

    const movieSuggestions = await geminiAPI.callWithTimeout(movieList);
    const movieMetadata = [];

    for (const movie of movieSuggestions) {
      if (movie === "") continue; // Skip empty suggestions
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
