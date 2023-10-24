const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [{"username": "jack", "password": "ciafardo"}];

const isValid = (username)=>{
    let repeat_users = users.filter((user) => user.username === username)
    if (repeat_users.length === 0){
        return true  
        
    }
    else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ 
    for(const user of users){
        console.log(user.username)
        if (user.username === username && user.password === password){
            return true
        }
    return false    
    }
}


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   let token = req.headers.authorization
   let isbn = req.params.isbn 
   let review = req.query.review
   if(token && isbn && review){
    jwt.verify(token, "access", (err, decoded) =>{
        if (err){
            return(res.send("someting odd"))
        }
        else{
         let book_reviews = books[isbn]['reviews']
         let username = decoded.username
         const filteredReview = book_reviews.filter(review => review.username === username);
         if(filteredReview.length === 1){
             filteredReview[0].review = review
         }
         else if(filteredReview.length === 0){
             let new_entry = {"username": username, "review": review}
             book_reviews.push(new_entry)
         }

         else{
             return res.send("user has multiple entried this is a issue")
         }
         return res.send(book_reviews)
        }
         
   })
   }

   else{
       return(res.send("params not found"))
   }
   
  

  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let token = req.headers.authorization;
    let isbn = req.params.isbn;
    let book_reviews = books[isbn]['reviews']
    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            return res.send("Something odd");
        } else {
            let username = decoded.username;
            const filteredReview = books[isbn]['reviews'].findIndex(review => review.username === username);
            if (filteredReview !== -1) {
                book_reviews.splice(filteredReview, 1)
                return res.send(books[isbn]['reviews']);
            } else {
                return res.send("Review not found for your user");
            }
        }
    });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
