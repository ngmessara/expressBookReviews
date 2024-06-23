const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const hasUser = (username)=>{
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

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (hasUser(username)) { 
            return res.status(404).json({message: "User already exists"});    
        }
        else {
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "User " + username + " has been registered"});
        }
    } 
    return res.status(404).json({message: "User or password not provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    // original implementation
    //res.send(JSON.stringify({books},null,4));

    // promise implementation
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise resolved")
        }, 300)
    })

    myPromise.then((successMessage) => {
        let bookArray = {};

        for (let key in books){
            bookArray[key] = books[key].title;
        }
        res.send(books);
        }
    )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    // original implementation
    /*
    const isbn = req.params.isbn;
    res.send(books[isbn])
    */

    // asycn implemenation
    const isbn = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    res.send(filtered_books);
 });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    // original implementation
    /*
    let ans = []
    for (const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for (let i = 0; i < book.length ; i++){
            if (book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if (ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
    */

    // promise implementation
    const author = req.params.author;
    
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise resolved")
        }, 300)})
    myPromise.then((successMessage) => {
        let ans = [];
        for (let key in books){
            if (books[key].author === author){
                ans.push(books[key]);
            }
        }
        //let booksbyauthor = {"booksbyauthor": booklist}
        res.send(ans);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    // original implementation
    /*
    let ans = []
    for (const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for (let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] == req.params.title){
                ans.push(books[key]);
            }
        }
    }
    if (ans.length == 0){
        return res.status(300).json({message: "Title not found"});
    }
    res.send(ans);
    */

    // promise implementation
    const title = req.params.title;
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("Promise resolved")
        }, 300)})
    myPromise.then((successMessage) => {
        let ans = [];
        for (let key in books){
            if(books[key].title == title){
                ans.push(books[key]);
            }
        }
        res.send(ans);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
