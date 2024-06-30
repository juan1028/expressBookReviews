const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
      "username": "user1",
      "password": "123456"
  }
];

const isValid = (username)=>{ 
  return users.find(user => user.username === username);
};

const authenticatedUser = (username,password)=>{ 
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  return !!validUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username:username, userPassword: password },
      "fingerprint_customer",
      {
        expiresIn: 60 * 60,
      }
    );
    req.session.accessToken = accessToken;
    
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).send("Invalid Login. check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.session.accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const decodedToken = jwt.verify(req.session.accessToken, "fingerprint_customer");
    const { username } = decodedToken;    
    books[isbn].reviews[username] = review;
    return res
        .status(200)
        .json({ message: "review added successfully", reviews: books[isbn].reviews });
} catch (error) {
    return res.status(401).json({ message: error.message });
}
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const decodedToken = jwt.verify(req.session.accessToken, "fingerprint_customer");
  const { username } = decodedToken;    
  
  delete books[isbn].reviews[username];
  return res
    .status(200)
    .json({ message: "review deleted", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
