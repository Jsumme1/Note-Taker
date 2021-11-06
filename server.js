const fs = require("fs");
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
//  instantiate the server
const app = express();
// uuid to make a unique id for each note
const { v4: uuidv4 } = require("uuid");
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("./public"));

let notes = require("./db/db");

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id !== id);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(result , null, 2)
      );
      notes = result;
}

function createNewNote(body, notesArray) {
  const note = body;
  console.log(notesArray);
  notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(notesArray, null, 2)
    );
return note;
}


app.get("/api/notes", (req, res) => {
res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);

   res.json(notes);

});

app.post("/api/notes", (req, res) => {

  // set id based uuidv4()
  req.body.id = uuidv4();
  // add note to json file and notes array in this function
  const note = createNewNote(req.body, notes);

  res.json(note);
}
);


app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// chain listen method onto our server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
