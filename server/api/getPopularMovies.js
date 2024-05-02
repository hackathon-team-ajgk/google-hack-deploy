const movieAPI = require("../services/movieApiHandler");

module.exports = async (req, res) => {
  try {
    const data = await movieAPI.getPopularMovieHandler();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res
      .status(500)
      .json({ error: "Error fetching popular movies", details: error.message });
  }
};
