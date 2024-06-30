const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({message: 'Please provide a valid username and password'});
  }

  // Check if username already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: 'Username already exists'});
  }

  // Add the new user to the users array
  users.push({username, password});

  // Return a success message
  return res.status(200).json({message: 'User registered successfully'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 2));
    })
    .then(data => {
        res.status(200).send(`List of books available: \n${data}`);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let booksList=Object.values(books)
  new Promise((resolve, reject) => {
  let book = books[isbn];
  if (book) {
    resolve(JSON.stringify(book));
    } else {
    reject(`No book found for ISBN ${isbn}`);}
    })
    .then(data => {
        res.send(`Book details for ISBN ${isbn}: ${data}`);
    });
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
  let title = req.params.title;
  let booksList=Object.values(books)
 let book = booksList.find(b => b.title===title);
  if (book) {
    let bookDetails = JSON.stringify(book);
    res.send(`Book details for title ${title}: ${bookDetails}`);
  } else {
    res.send(`No book found for title ${title}`);}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if(!Object.keys(book.reviews).length) {
        return res.status(404).json({ message: "Reviews not found for this book" });
    } 
  
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
