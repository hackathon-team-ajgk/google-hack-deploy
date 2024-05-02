const connectToDatabase = require("../utils/db");
const authenticateToken = require("../utils/auth");

module.exports = async (req, res) => {
  try {
    // Authenticate user and get user data from token
    const user = authenticateToken(req);
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch user data based on username from the token
    const userData = await usersCollection.findOne(
      { username: user.username },
      { projection: { password: 0 } }
    );

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    if (
      error.message === "No token provided" ||
      error.message === "Invalid token"
    ) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
