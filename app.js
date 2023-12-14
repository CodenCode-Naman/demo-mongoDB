/* The code is setting up a basic Express.js server that handles HTTP requests related to books. Here's
a breakdown of what the code does: */
const express = require("express");
const { getDb, connectToDb } = require("./db");

// init app & middleware
const app = express();
app.use(express.json()); // Add this line to parse JSON request bodies

// db connection
let db;

/* The `connectToDb` function is used to establish a connection to the database. It takes a callback
function as an argument, which will be executed once the connection is established or if there is an
error. */
connectToDb((err) => {
  if (!err) {
    app.listen("3000", () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes
/* The code block is defining a route for handling HTTP GET requests to retrieve a list of books from
the database. When a GET request is made to the "/books" endpoint, the code performs the following
steps: */
app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .sort({ name: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

/* The code block is defining a route for handling HTTP POST requests to create a new book in the
database. When a POST request is made to the "/books" endpoint, the code retrieves the new book data
from the request body using `req.body`. It then inserts the new book into the "books" collection in
the database using the `insertOne()` method. */
app.post("/books", (req, res) => {
  const newBook = req.body; // Assuming the request body contains the new book data

  db.collection("books")
    .insertOne(newBook)
    .then(() => {
      res.status(201).json({ message: "Book created successfully" });
    })
    .catch(() => {
      res.status(500).json({ error: "Could not create the book" });
    });
});

/* This code block is defining a route for handling HTTP DELETE requests to delete a book from the
database. */
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete document" });
      });
  } else {
    res.status(500).json({ error: "Could not delete document" });
  }
});
