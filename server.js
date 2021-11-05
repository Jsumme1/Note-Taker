const fs = require("fs");
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
//  instantiate the server
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));

const { notes } = require("./db/db");

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

app.get("/api/notes", (req, res) => {
res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("The notes with the given ID was not found.");
  }
});

app.post("/api/notes", (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();
  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
  }
});

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}
// app.get("/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/notes.html"));
// });

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

// chain listen method onto our server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
