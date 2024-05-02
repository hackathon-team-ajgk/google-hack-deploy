const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

module.exports = async (req, res) => {
  try {
    // Authenticate user and extract the username from token
    const userClaims = authenticateToken(req);
    const { bio } = req.body;

    if (!bio) {
      return res.status(400).json({ error: "Bio is required" });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Update the user's bio in the database
    const result = await usersCollection.updateOne(
      { username: userClaims.username },
      { $set: { bio: bio } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
    console.error("Error updating bio:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
