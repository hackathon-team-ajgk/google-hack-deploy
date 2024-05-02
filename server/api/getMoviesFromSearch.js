const movieAPI = require("../services/movieApiHandler");

module.exports = async (req, res) => {
  try {
    const { movie } = req.query;
    if (!movie) {
      return res
        .status(400)
        .json({ error: "No movie specified in the search query" });
    }

    const data = await movieAPI.searchForMovie(movie);
    if (data === undefined) {
      return res.status(404).json({ error: "No movie data found for search" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
