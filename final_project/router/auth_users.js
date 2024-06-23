const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//write code to check if username is already present in records.
const isValid = (username)=>{
    let matchedUsers = users.filter((user)=>{
        return user.username === username
    });

    if (matchedUsers.length > 0){
        return true;
    }
    else {
        return false;
    }
}

//write code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean
    let matchedUsers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if (matchedUsers.length > 0){
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // check if there are both username and password
    if (!username || !password) {
        return res.status(404).json({message: "User or password not provided"});
    }
  
    // authenticate user
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});
  
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Logged in successfully");
    }
    else {
        return res.status(208).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username; //req.user.data;
    const book = books[isbn];

    if (book) {
        book.reviews[username] = review;
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Invalid ISBN" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = await books[isbn]
        delete book.reviews[username]
        return res.status(200).send('Review deleted')
    }
    else {
        return res.status(404).json({ message: "Invalid ISBN" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
