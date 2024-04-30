const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const API_READ_ACCESS_TOKEN = process.env.GEMINI_API;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(API_READ_ACCESS_TOKEN);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function giveMovieSuggestionsBasedOnGenre(userText) {
  try {
    console.log("Searching for " + userText + " movies...");
    const message =
      "Can you give 10 movie suggestions based on the given genre. Give me the movie suggestions in the following format: [movie1|movie2|movie3|etc]: ";

    const result = await model.generateContent(message + userText);
    const response = await result.response;
    const text = response.text();
    // console.log(text)
    // Formatting AI recommendations
    const regex = /\d+\./; //   \d+: Matches one or more digits and \. Matches a period
    finalText = text
      .replace("[", "")
      .replace("]", "")
      .replace(regex, "")
      .split("|");
    // finalText.forEach(movie => console.log(movie)) // For testing only

    // Checking for unwanted formatting or values
    const nonEmptyMovies = outputFormatting(finalText);
    console.log(nonEmptyMovies);

    // Recursive call if array is empty
    if (nonEmptyMovies.length === 1 && nonEmptyMovies[0] === "") {
      console.log("Empty array detected. Generating new movie suggestions...");
      return giveMovieSuggestionsBasedOnGenre(userText);
    }

    // console.log(nonEmptyMovies) // For testing only
    return nonEmptyMovies;
  } catch (error) {
    console.log("Error giving movie suggestions based on the genre: " + error);
  }
}

/* async function test() {
    const x = await giveMovieSuggestionsBasedOnGenre("Romance")
    console.log(x)
}
test() */
//Tallies the most popular genres in the users movie list, and then returns movies that are related to those genres
async function tallyGenreInMovieList(movieData) {
  try {
    const genreTallyTotal = {
      Action: 0,
      Adventure: 0,
      Animation: 0,
      Comedy: 0,
      Crime: 0,
      Documentary: 0,
      Drama: 0,
      Family: 0,
      Fantasy: 0,
      History: 0,
      Horror: 0,
      Music: 0,
      Mystery: 0,
      Romance: 0,
      "Science Fiction": 0,
      "TV Movie": 0,
      Thriller: 0,
      War: 0,
      Western: 0,
    };

    const watchedMoviesList = movieData.watchedMovies || [];
    const watchLaterList = movieData.watchLaterList || [];

    watchedMoviesList.forEach((movie) => {
      movie.genreNames.split(",").forEach((item) => {
        const trimmedItem = item.trim(); // Remove leading/trailing spaces
        if (trimmedItem in genreTallyTotal) {
          genreTallyTotal[trimmedItem] += 1;
        }
      });
    });

    watchLaterList.forEach((movie) => {
      movie.genreNames.split(",").forEach((item) => {
        const trimmedItem = item.trim(); // Remove leading/trailing spaces
        if (trimmedItem in genreTallyTotal) {
          genreTallyTotal[trimmedItem] += 1;
        }
      });
    });
    console.log(genreTallyTotal);
    return genreTallyTotal;
  } catch (error) {
    console.error("Error tallying genres:", error);
    throw error; // Re-throw the error to handle it outside this function
  }
}
// tallyGenreInMovieList()

// Make function that takes dictionary as input to gemini
async function giveMovieSuggestionsBasedOnMovieList(movieData) {
  try {
    const dictionary = await tallyGenreInMovieList(movieData);
    const formattedDictionary = JSON.stringify(dictionary);

    // Checking if dictionary is empty (problems loading dict). THIS COULD BE THE THING GIVING PROBLEMS RENDERING TWICE IN FRONTEND
    if (!formattedDictionary.trim()) {
      console.log("Formatted dictionary is empty. Exiting...");
      return giveMovieSuggestionsBasedOnMovieList();
    }

    const message =
      "Can you give 10 movie suggestions based on the two highest genres in this dictionary. Give me this informantion in the following format: [movie1|movie2|movie3|etc]";
    const result = await model.generateContent(message + formattedDictionary);
    const response = await result.response;
    const text = response.text();

    // Formatting AI recommendations
    const regex = /\d+\./; //   \d+: Matches one or more digits and \. Matches a period
    finalText = text
      .replace("[", "")
      .replace("]", "")
      .replace(regex, "")
      .split("|");
    // finalText.forEach(movie => console.log(movie)) // For testing only

    // Checking for unwanted formatting or values
    const nonEmptyMovies = outputFormatting(finalText);

    // Recursive call if array is empty
    if (nonEmptyMovies.length === 1 && nonEmptyMovies[0] === "") {
      console.log("Empty array detected. Generating new movie suggestions...");
      return giveMovieSuggestionsBasedOnMovieList();
    }

    // console.log(nonEmptyMovies) // For testing only
    return nonEmptyMovies;
  } catch (error) {
    console.log(
      "There was an error processing or getting recommendations from the movies in the movie list: " +
        error
    );
  }
}
// giveMovieSuggestionsBasedOnMovieList()

// giveMovieSuggestionsBasedOnMovieList function but with a timer
async function callWithTimeout(movieList) {
  const timeoutMs = 3500; // Max # ms allowed. Works with 3s unless list needs to be regenerated. 3.5s otherwise

  const movieSuggestionsPromise =
    giveMovieSuggestionsBasedOnMovieList(movieList);
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(resolve, timeoutMs)
  );

  try {
    const result = await Promise.race([
      movieSuggestionsPromise,
      timeoutPromise,
    ]);
    if (result !== undefined) {
      console.log("Movie suggestions call completed:");
      console.log(result);
      return result;
    } else {
      console.log("Function execution timed out");
      return null; // Or handle the timeout error as needed
    }
  } catch (error) {
    console.log("Function execution failed:", error);
    return null; // Or handle the error as needed
  }
}
// callWithTimeout()

// Helper function
function outputFormatting(finalText) {
  const nonEmptyMovies = []; // Array to store non-empty movie names
  const startsWithNewline = (str) => /^\n/.test(str); // Function to check if a string starts with a newline character (\n)

  finalText.forEach((movie) => {
    // Remove leading and ending white spaces
    movie = movie.trim();

    // Max length
    if (movie.length >= 55) {
      return;
    }

    // Checking for undefined
    if (movie === "undefined") {
      throw new Error("Undefined movie detected.");
    }

    // Checking if * in title
    if (movie.includes("*")) {
      return;
    }

    // Checking if punctuation in start or end of string
    const startsWithPunctuation = (str) => /^[^\w\s]/.test(str);
    const endsWithPunctuation = (str) => /[^\w\s]$/.test(str);
    if (startsWithPunctuation(movie) || endsWithPunctuation(movie)) {
      return;
    }

    // Checking if name starts with a number followed by a period
    if (/^\d+\./.test(movie)) {
      return;
    }

    // Checking if name starts with a newline character (\n)
    if (startsWithNewline(movie)) {
      return;
    }

    // Add non-empty movie to the new array
    nonEmptyMovies.push(movie);
  });
  // console.log(nonEmptyMovies) // For testing only
  // Checking if entire list is empty
  if (nonEmptyMovies.length === 0) {
    return [""]; // Return an array with a single empty string
  }

  return nonEmptyMovies; // Return the array containing non-empty movie names
}

module.exports = {
  giveMovieSuggestionsBasedOnGenre,
  tallyGenreInMovieList,
  giveMovieSuggestionsBasedOnMovieList,
  callWithTimeout,
  outputFormatting,
};
/*
TODO:
- Output validation from AI response. Specifically, when there is an error with the dictionary. To test this,
  try removing the await from the first line after the 'try{' in the giveMovieSuggestionsBasedOnMovieList function
- Output validation for AI response in giveMovieSuggestionsBasedOnMovieList function. Run the function many times and 
  deal with (or decide that its safe not to) random characters and formatting that shouldnt be the way it is
- More I/O validation
- MORE OUTPUT validation. SUPER weird outputs sometimes recieved from AI in giveMovieSuggestionsBasedOnMovieList function
- Think about optimization
- READ API USAGE LIMITS ON THE DOCUMENTATION. Make sure we have enough leeway for every potential user and for regenerating when invalid responses
 */
