const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

module.exports = async (req, res) => {
  try {
    // Authenticate user
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user in the database
    const userInDb = await usersCollection.findOne({ username: user.username });
    if (!userInDb) {
      return res.status(404).json({ error: "Cannot find user" });
    }

    // Delete the user from the database
    await usersCollection.deleteOne({ username: user.username });

    // Return success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
