const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const API_READ_ACCESS_TOKEN = process.env.GEMINI_API;
const { json } = require("express");
const fetch = require('node-fetch');

const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(API_READ_ACCESS_TOKEN)
const model = genAI.getGenerativeModel({model: "gemini-pro"})
const fs = require('fs');
const { type } = require("os");
const { error } = require("console");

async function giveMovieSuggestionsBasedOnGenre(userText) {
    try {
        const message = "Give me a list of ten movies in array format based on this genre without the year:  "
    
        //perform i/o validation 
        const result = await model.generateContent(message+userText)
        const response = await result.response;
        const text = response.text()
        console.log(text)
    
        return text
    } catch (error) {
        console.log("Error giving movie suggestions based on the genre: " + error)
    }
    

}

//Tallies the most popular genres in the users movie list, and then returns movies that are related to those genres 
async function tallyGenreInMovieList() {
    const fs = require('fs').promises; // Use fs.promises for promise-based file operations

    try {
        const data = await fs.readFile(path.join(__dirname, './object.json'), 'utf-8');
        const jsonData = JSON.parse(data);

        const genreTallyTotal = {
            "Action": 0,
            "Adventure": 0,
            "Animation": 0,
            "Comedy": 0,
            "Crime": 0,
            "Documentary": 0,
            "Drama": 0,
            "Family": 0,
            "Fantasy": 0,
            "History": 0,
            "Horror": 0,
            "Music": 0,
            "Mystery": 0,
            "Romance": 0,
            "Science Fiction": 0,
            "TV Movie": 0,
            "Thriller": 0,
            "War": 0,
            "Western": 0
        };

        const watchedMoviesList = jsonData.movieData.watchedMovies.movie;
        const watchLaterList = jsonData.movieData.watchLaterList.movie;

        watchedMoviesList.forEach(movie => {
            movie.genreNames.split(',').forEach(item => {
                if (item in genreTallyTotal) {
                    genreTallyTotal[item] += 1;
                }
            });
        });

        watchLaterList.forEach(movie => {
            movie.genreNames.split(',').forEach(item => {
                if (item in genreTallyTotal) {
                    genreTallyTotal[item] += 1;
                }
            });
        });

        // console.log(genreTallyTotal);
        return genreTallyTotal
        
    } catch (error) {
        console.error('Error reading user file:', error);
        throw error; // Re-throw the error to handle it outside this function
    }
}
// tallyGenreInMovieList()

// Make function that takes dictionary as input to gemini
async function giveMovieSuggestionsBasedOnMovieList() {
    try {
        const dictionary = await tallyGenreInMovieList()
        const formattedDictionary = JSON.stringify(dictionary)

        // Checking if dictionary is empty (problems loading dict)
        if (!formattedDictionary.trim()) {
            console.log("Formatted dictionary is empty. Exiting...")
            return giveMovieSuggestionsBasedOnMovieList();
        }
        
        const message = 'Can you give 10 movie suggestions based on the two highest genres in this dictionary. Give me this informantion in the following format: [movie1|movie2|movie3|etc]' 
        const result = await model.generateContent(message+formattedDictionary)
        const response = await result.response;
        const text = response.text()

        // Formatting AI recommendations
        const regex = /\d+\./ //   \d+: Matches one or more digits and \. Matches a period
        finalText = text.replace('[', '').replace(']', '').replace(regex, '').split('|')
        finalText.forEach(movie => console.log(movie)) // For testing only

        // Checking for unwanted formatting or values
        const nonEmptyMovies = outputFormatting(finalText) 

        // Recursive call if array is empty
        if (nonEmptyMovies.length === 1 && nonEmptyMovies[0] === '') {
            console.log("Empty array detected. Generating new movie suggestions...")
            return giveMovieSuggestionsBasedOnMovieList()
        }

        console.log(nonEmptyMovies)
        return nonEmptyMovies
    } catch (error) {
        console.log("There was an error processing or getting recommendations from the movies in the movie list: " + error)
    }
}
giveMovieSuggestionsBasedOnMovieList()

// Helper function
function outputFormatting(finalText) {
    const nonEmptyMovies = []; // Array to store non-empty movie names
    
    finalText.forEach((movie) => {
        // Max length
        if (movie.length >= 55) {
            return;
        }

        // Checking for undefined
        if (movie === 'undefined') {
            throw new Error('Undefined movie detected.');
        }
        
        // Checking if * in title
        if (movie.includes('*')) {
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

        // Add non-empty movie to the new array
        nonEmptyMovies.push(movie);
    });
    // Checking if entire list is empty
    if (nonEmptyMovies.length === 0) {
        return ['']; // Return an array with a single empty string
    }

    return nonEmptyMovies; // Return the array containing non-empty movie names
}



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