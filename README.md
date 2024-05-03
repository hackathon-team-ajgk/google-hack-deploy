# MYMOVIELIST – Your personal Movie Organizer 


## OVERVIEW  

MyMovieList is a comprehensive web application to help movie enthusiasts manage their personal movie collections, discover and get recommendations for movies to watch, and organize their whole personal viewing experience. This project combines user-friendly design with important features such as user authentication, personalized lists, and extensive movie details, all tailored to enhance your own personal watching experience.  


## HOW CLIENT CONNECTS WITH SERVER? 

User and Application Interface: The user interacts with the application through our user interface built with React. The user inputs are sent from the UI to the backend server using REST API requests 

Frontend: The front-end is responsible for presenting information to the user and collecting user input. It then communicates with the server via GET requests and receives the data that it then displays to the user. The Front-End performs CRUD (Create, Read, Update, Delete) operations itself and the server is calling the functions inside the movieAPI handler and the GeminiApi handler responses 

Backend Server: The server splits into different handlers for their own specific functions; movieAPIHandler for the movie-related requests and geminiAPIHandler for requests handled by the Gemini API

Database: MongoDB is then used as the database solution, storing historical and operation data that the server queries or modifies. This database is integral for persisting data that is accessed and manipulated by the API Handlers.  

All in all, the user sends a request from the front end which is received by the server. The server processes the request, fetching or storing data in MongoDB as necessary. The requested data or result of the operation is then sent back to the front end as a REST response, which updates the UI accordingly.  


## Main Features 

MyMovieList offers a variety of features that makes it have seamless navigation across the various sections, ensuring a fluid user experience:  

Homepage: Displays a curated selection of the latest and trending movies to keep users engaged with fresh and trending movies.  

User Authentication: Incorporates necessary security measures for user registration and login, safeguarding user data.  

User Profile: Allows users to personalize their own experience by viewing and editing their profile information  

Movie Listings: Users can explore a diverse array of movies sorted into categories, making it easy to find films of interests  

Search and Filter: Search for movies based on keywords; filter movies by genre 

Movie Details: Click on any movie to get detailed information like cast, crew, synopsis 

Your List: Provides a personalized watchlist where users can save and manage their favorite movies and save future films for future viewing.  

About Page: Offers insights into the application's purpose, its features, and the minds behind its development  

## Contributing 

Interested in contributing? Fantastic! Here are some ways you can help:  

Bug Reports: Report issues and suggest improvements.  

Feature Requests: Propose ideas for new features 

	 

 
