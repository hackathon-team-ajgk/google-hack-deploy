const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

/**
 * Route to remove a movie from user's lists
 * @name PUT/remove-movie
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
module.exports = async (req, res) => {
  try {
    // Authenticate user and extract the username from the token
    const userClaims = authenticateToken(req);
    const { movieName, status } = req.body;

    if (!movieName || !status) {
      return res
        .status(400)
        .json({ error: "Missing required fields: movieName or status" });
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

    let removedMovie = null;

    // Find and remove the movie from the watchedMovies list
    if (status === "Watched") {
      if (user.movieData.watchedMovies) {
        removedMovie = user.movieData.watchedMovies.find(
          (movie) => movie.title === movieName
        );
        if (removedMovie) {
          user.movieData.watchedMovies = user.movieData.watchedMovies.filter(
            (movie) => movie.title !== movieName
          );
        }
      }
    } else if (status === "Watch Later") {
      // Find and remove the movie from the watchLaterList
      if (user.movieData.watchLaterList) {
        removedMovie = user.movieData.watchLaterList.find(
          (movie) => movie.title === movieName
        );
        if (removedMovie) {
          user.movieData.watchLaterList = user.movieData.watchLaterList.filter(
            (movie) => movie.title !== movieName
          );
        }
      }
    } else {
      return res.status(404).send(`Movie with name ${movieName} not found`);
    }

    // Update the user document in the database
    await usersCollection.updateOne(
      { username },
      { $set: { movieData: user.movieData } }
    );

    // Sending status/logging to the user
    if (removedMovie) {
      console.log(
        `Movie ${removedMovie.title} removed successfully for user ${username}`
      );
      res.send(`Movie ${removedMovie.title} removed successfully`);
    } else {
      console.log(
        `Movie with name ${movieName} not found for user ${username}`
      );
      res.status(404).send(`Movie with name ${movieName} not found`);
    }
  } catch (error) {
    console.error("Error removing movie:", error);
    res.status(500).send("Internal Server Error");
  }
};
