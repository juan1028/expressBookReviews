const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksList = JSON.stringify(books, null, 2);
  return res.status(200).send(`List of books available: \n${booksList}`);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let booksList=Object.values(books)
  let book = books[isbn];
  if (book) {
    let bookDetails = JSON.stringify(book);
    res.send(`Book details for ISBN ${isbn}: ${bookDetails}`);
  } else {
    res.send(`No book found for ISBN ${isbn}`);}
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(b => b.author === author);
    if (booksByAuthor.length === 0) {
        reject("No books found for this author");
    } else {
        resolve(booksByAuthor);
    }
})
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
