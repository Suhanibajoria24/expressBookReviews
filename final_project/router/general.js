const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('URL_TO_GET_BOOKS'); // Replace with the actual URL or local API endpoint to get books
    return res.json(response.data); // Send the data retrieved from the external API as JSON
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const { isbn } = req.params; // Get ISBN from request parameters
  try {
    const response = await axios.get(`URL_TO_GET_BOOK/${isbn}`); // Replace with the actual URL or local API endpoint to get book details by ISBN
    return res.json(response.data); // Send the data retrieved from the external API as JSON
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const { author } = req.params; // Get author from request parameters
  try {
    const response = await axios.get(`URL_TO_GET_BOOKS_BY_AUTHOR/${author}`); // Replace with the actual URL or local API endpoint to get books by author
    return res.json(response.data); // Send the data retrieved from the external API as JSON
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const { title } = req.params; // Get title from request parameters
  try {
    const response = await axios.get(`URL_TO_GET_BOOKS_BY_TITLE/${title}`); // Replace with the actual URL or local API endpoint to get books by title
    return res.json(response.data); // Send the data retrieved from the external API as JSON
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Look for the book in the books object using the ISBN

  if (book) {
      return res.status(200).json(book.reviews); // Send the book reviews if found
  } else {
      return res.status(404).json({ message: "Book not found" }); // Send an error if the book is not found
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
