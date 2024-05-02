const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

/**
 * Retrieves movie data associated with the authenticated user
 * @name GET/getUserMovieData
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - The movie data associated with the user
 */
module.exports = async (req, res) => {
  try {
    // Authenticate user and extract user data from token
    const user = authenticateToken(req);
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch the user's movie data based on username from the token
    const userData = await usersCollection.findOne(
      { username: user.username },
      { projection: { movieData: 1, _id: 0 } }
    );

    if (!userData || !userData.movieData) {
      return res
        .status(404)
        .json({ error: "User not found or no movie data available" });
    }

    res.status(200).json(userData.movieData);
  } catch (error) {
    if (
      error.message === "No token provided" ||
      error.message === "Invalid token"
    ) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Error retrieving user movie data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
