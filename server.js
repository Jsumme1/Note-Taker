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
app.use(express.static(__dirname, "./public"));

const { notes } = require("./db/db");

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify({ notes: notesArray }, null, 2)
    );
return note;
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
  req.body.id = notes.length.toString()
 // add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);

    res.json(note);
  }
);

app.delete("/", function (req, res) {
  res.send("DELETE request to homepage");
});


app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// chain listen method onto our server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
