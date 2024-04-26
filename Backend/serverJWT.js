/**
 * Module dependencies.
 */
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
app.use(express.json());

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@moviesitedb.dzkecdm.mongodb.net/MovieSiteDB`;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/**
 * Middleware to authenticate JWT token.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void}
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.send("No token");

  jwt.verify(token, process.env.JWT_SECRET, (err, body) => {
    if (err) return res.send("Unverified token");
    req.user = body;
    // console.log(req.user) // For testing only
    next();
  });
}

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the MongoDB server
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Use the appropriate database and collection
    const db = client.db("MovieSiteDB");
    const usersCollection = db.collection("users");

    /**
     * Route to fetch specific user data.
     * @name GET/user
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.get("/user", authenticateToken, async (req, res) => {
      try {
        // Retrieve all users from the database
        // console.log(req.user.username) // Should be name of whatever you signed in as
        const users = await usersCollection.find().toArray();
        res.json(users.filter(user => user.username === req.user.username));
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    /**
     * Route to fetch all users.
     * @name GET/allUsers
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.get("/allUsers", async (req, res) => {
      try {
        // Retrieve all users from the database
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    /**
     * Route to register a new user.
     * @name POST/register
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.post("/register", async (req, res) => {
      try {
        // Hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Insert the new user into the database
        const newUser = {
          username: req.body.username,
          password: hashedPassword,
          movieData: req.body.movieData,
        };
        await usersCollection.insertOne(newUser);
        res.status(201).send("User created successfully");
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    /**
     * Route to log in a user.
     * @name POST/login
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.post("/login", async (req, res) => {
      const user = await usersCollection.findOne({
        username: req.body.username,
      });
      if (user === null) {
        return res.status(400).send("Cannot find user");
      }
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const username = req.body.username;
          const user = { username: username };
          const accessToken = jwt.sign(user, process.env.JWT_SECRET);
          console.log(accessToken);
          res.send("Success");
        } else {
          res.status(401).send("Incorrect password");
        }
      } catch {
        res.status(500).send();
      }
    });

    /**
     * Route to update the state of a movie.
     * @name PUT/edit-movie-state
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.put('/edit-movie-state', authenticateToken, async (req, res) => {
      try {
        const { username, action, movie } = req.body;
  
        if (!username || !action || !movie) {
          return res.status(400).send("Missing required fields");
        }

        // Retrieve the user from the database
        const user = await usersCollection.findOne({ username });
        if (!user) {
          return res.status(404).send("User not found");
        }
        /*   
        console.log('User:', user);
        console.log('Action:', action);
        console.log('Movie:', movie);
        */
        // Update the movie state based on the action
        if (action === "watch" || action === "watch-later") {
          // Determine which list to update
          const listToUpdate = action === "watch" ? "watchedMovies" : "watchLaterList";
          // Ensure that the movieData object and the listToUpdate exist
          user.movieData = user.movieData || {};
          user.movieData[listToUpdate] = user.movieData[listToUpdate] || [];
          // Add the movie to the specified list
          user.movieData[listToUpdate].push(movie);
          // Update the user document in the database
          await usersCollection.updateOne(
              { username },
              { $set: { movieData: user.movieData } }
          );
          console.log(`${movie.title} added to ${listToUpdate} successfully for user ${username}`);
          res.send(`Movie '${movie.title}' added to '${listToUpdate}' successfully`);
        } else {
            res.status(400).send("Invalid action");
        }
      } catch (error) {
          console.error("Error updating movie state:", error);
          res.status(500).send("Internal Server Error");
      }
    });
    
    
    /**
     * Route to remove a movie from user's lists.
     * @name PUT/remove-movie
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.put('/remove-movie', authenticateToken, async (req, res) => {
      try {
          const { username, movieName } = req.body;
          if (!username || !movieName) {
              return res.status(400).send("Missing required fields");
          }

          // Retrieve the user from the database
          const user = await usersCollection.findOne({ username });
          if (!user) {
              return res.status(404).send("User not found");
          }
          let removedMovie = null;

          // Find and remove the movie from the watchedMovies list
          if (user.movieData.watchedMovies) {
              removedMovie = user.movieData.watchedMovies.find(movie => movie.title === movieName);
              if (removedMovie) {
                  user.movieData.watchedMovies = user.movieData.watchedMovies.filter(movie => movie.title !== movieName);
              }
          }

          // Find and remove the movie from the watchLaterList
          if (user.movieData.watchLaterList) {
              removedMovie = user.movieData.watchLaterList.find(movie => movie.title === movieName);
              if (removedMovie) {
                  user.movieData.watchLaterList = user.movieData.watchLaterList.filter(movie => movie.title !== movieName);
              }
          }

          // Update the user document in the database
          await usersCollection.updateOne(
              { username },
              { $set: { movieData: user.movieData } }
          );

          // Sending status/logging to the user
          if (removedMovie) {
              console.log(`Movie ${removedMovie.title} removed successfully for user ${username}`);
              res.send(`Movie ${removedMovie.title} removed successfully`);
          } else {
              console.log(`Movie with name ${movieName} not found for user ${username}`);
              res.status(404).send(`Movie with name ${movieName} not found`);
          }
      } catch (error) {
          console.error("Error removing movie:", error);
          res.status(500).send("Internal Server Error");
      }
    });

    /**
     * Route to update user's rating for a movie.
     * @name PUT/update-user-rating
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @returns {void}
     */
    app.put('/update-user-rating', authenticateToken, async (req, res) => {
      try {
          const { username, movieTitle, userRating } = req.body;

          if (!username || !movieTitle || userRating === undefined || userRating < 0 || userRating > 5) {
              return res.status(400).send("Invalid request. Please provide username, movieTitle, and a userRating between 0 and 5.");
          }

          // Retrieve the user from the database
          const user = await usersCollection.findOne({ username });
          if (!user) {
              return res.status(404).send("User not found");
          }

          // Check if the movie exists in the watchedMovies list
          const movieIndex = user.movieData.watchedMovies.findIndex(movie => movie.title === movieTitle);
          if (movieIndex === -1) {
              return res.status(404).send("Movie not found in watchedMovies list. Please add the movie to your list first.");
          }

          // Update the userRating of the movie
          user.movieData.watchedMovies[movieIndex].userRating = userRating;

          // Update the user document in the database
          await usersCollection.updateOne(
              { username },
              { $set: { movieData: user.movieData } }
          );

          console.log(`User rating for ${movieTitle} updated successfully for user ${username}`);
          res.send(`User rating for ${movieTitle} updated successfully`);
      } catch (error) {
          console.error("Error updating user rating:", error);
          res.status(500).send("Internal Server Error");
      }
    });

    // Add other routes here...
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
} 

// Start the server after connecting to the database
const PORT = 3000; 
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
});

/* 
TO DO:
- More error handling (more detailed error messages)
- Input validation
- More security (should be fine???)
*/
