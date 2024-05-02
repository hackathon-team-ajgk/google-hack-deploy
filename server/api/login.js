const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../utils/db");

module.exports = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ error: "Cannot find user" });
    }

    // Compare the provided password with the stored hash
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Create a token
    const accessToken = jwt.sign(
      { username: username },
      process.env.JWT_SECRET
    );

    console.log("Successfully logged in");
    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
