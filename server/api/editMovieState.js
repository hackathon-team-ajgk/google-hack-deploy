const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

module.exports = async (req, res) => {
  try {
    // Authenticate user and extract username from token
    const userClaims = authenticateToken(req);
    const { action, movie } = req.body;
    if (!action || !movie) {
      return res.status(400).json({ error: "Missing required fields" });
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

    // Determine which list to update
    const listToUpdate =
      action === "watch" ? "watchedMovies" : "watchLaterList";
    const listToRemove =
      listToUpdate === "watchedMovies" ? "watchLaterList" : "watchedMovies";

    // Ensure that the movieData object and the lists exist
    user.movieData = user.movieData || {};
    user.movieData[listToUpdate] = user.movieData[listToUpdate] || [];
    user.movieData[listToRemove] = user.movieData[listToRemove] || [];

    // Check if the movie already exists in the specified list
    const movieIndex = user.movieData[listToUpdate].findIndex(
      (m) => m.movieId === movie.movieId
    );
    if (movieIndex !== -1) {
      return res
        .status(400)
        .json({ error: `Movie already exists in the '${listToUpdate}' list` });
    }

    // Remove the movie from the other list if present
    const indexInOtherList = user.movieData[listToRemove].findIndex(
      (m) => m.movieId === movie.movieId
    );
    if (indexInOtherList !== -1) {
      user.movieData[listToRemove].splice(indexInOtherList, 1);
    }

    // Add the movie to the specified list
    user.movieData[listToUpdate].push(movie);

    // Update the user document in the database
    await usersCollection.updateOne(
      { username: userClaims.username },
      { $set: { movieData: user.movieData } }
    );

    res.status(200).json({
      message: `Movie '${movie.title}' moved to '${listToUpdate}' successfully`,
    });
  } catch (error) {
    console.error("Error updating movie state:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
