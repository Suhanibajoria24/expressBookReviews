const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let reviews = {};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 return users.some(user => user.username === username); 
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body; // Extract username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate user credentials
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token with a secret key
    const accessToken = jwt.sign({ username: username }, "secret_key", { expiresIn: '1h' });

    // Respond with the generated token
    return res.status(200).json({
        message: "Login successful",
        token: accessToken
    });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.session; // Get the username from the session
    const { review } = req.query; // Get the review from the query parameters
    const { isbn } = req.params; // Get the ISBN from the request parameters

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Initialize reviews for this ISBN if it doesn't exist
    if (!reviews[isbn]) {
        reviews[isbn] = []; // Create an array to hold reviews for this ISBN
    }

    // Check if the user has already reviewed this book
    const existingReviewIndex = reviews[isbn].findIndex(r => r.username === username);

    if (existingReviewIndex > -1) {
        // Modify the existing review if it exists
        reviews[isbn][existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // Add a new review if it doesn't exist
        reviews[isbn].push({ username, review });
        return res.status(201).json({ message: "Review added successfully" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session; // Get the username from the session
    const { isbn } = req.params; // Get the ISBN from the request parameters

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if there are any reviews for this ISBN
    if (!reviews[isbn] || reviews[isbn].length === 0) {
        return res.status(404).json({ message: "No reviews found for this ISBN" });
    }

    // Filter out the review by the logged-in user
    const initialLength = reviews[isbn].length; // Length before deletion
    reviews[isbn] = reviews[isbn].filter(review => review.username !== username);

    // Check if any reviews were deleted
    if (reviews[isbn].length < initialLength) {
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
