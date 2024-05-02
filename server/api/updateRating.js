const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

/**
 * Route to update user's rating for a movie
 * @name PUT/update-user-rating
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
module.exports = async (req, res) => {
  try {
    // Authenticate user and extract username from token
    const userClaims = authenticateToken(req);
    const { movieTitle, userRating } = req.body;

    if (
      !movieTitle ||
      userRating === undefined ||
      userRating < 0 ||
      userRating > 5
    ) {
      return res.status(400).json({
        error:
          "Invalid request. Please provide movieTitle and a userRating between 0 and 5.",
      });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Retrieve the user from the database
    const user = await usersCollection.findOne({
      username: userClaims.username,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the movie exists in the watchedMovies list
    const movieIndex = user.movieData.watchedMovies.findIndex(
      (movie) => movie.title === movieTitle
    );

    if (movieIndex === -1) {
      return res.status(404).json({
        error:
          "Movie not found in watchedMovies list. Please add the movie to your list first.",
      });
    }

    // Update the userRating of the movie
    user.movieData.watchedMovies[movieIndex].userRating = userRating;

    // Update the user document in the database
    await usersCollection.updateOne(
      { username: userClaims.username },
      { $set: { movieData: user.movieData.watchedMovies } }
    );

    res
      .status(200)
      .json({ message: `User rating for ${movieTitle} updated successfully` });
  } catch (error) {
    console.error("Error updating user rating:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
