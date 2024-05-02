const bcrypt = require("bcrypt");
const connectToDatabase = require("../utils/db");

module.exports = async (req, res) => {
  const { username, password, movieData, bio } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if username already exists
    const userExists = await usersCollection.findOne({ username: username });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "User with that username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const newUser = {
      username,
      password: hashedPassword,
      movieData: movieData || {},
      bio: bio || "",
    };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
