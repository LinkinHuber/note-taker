const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


//Get route for '/' that returns the 'index.html' file.
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')),
);


//Get route for '/notes' that returns the 'notes.html' file.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html')),
);


//Delete route for '/api/notes/:id' that reads all the notes from the db.json file, removes the note with the given id property, and then rewrites the notes to the db.json file.
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if(err)
    return console.log(err);
    let notes = JSON.parse(data);
    let readNotes = notes.filter((note) => note.id != req.params.id);
    fs.writeFile(`./db/db.json`, JSON.stringify(readNotes), (err) =>
    err
      ? console.error(err)
      : console.log('note was successfully deleted')
    );
    res.json(readNotes);
  });
});


//Get route for '/api/notes' that reads the 'db.json' file and returns either an error if theres an error or if correct it returns all the saved notes as JSON.
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
      res.json(JSON.parse(data));
    }
  });
});


//Post route for '/api/notes' that receives a new note to save on the request body, adds it to the 'db.json' file, and then returns the new note to the client. To achieve this each note is also given a uniquely generated id using a math.random generator.
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add new note`);
  const { title, text } = req.body;
  if (title && text) {
    const newnote = {
      title,
      text,
      id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    };
    
    readAndAppend(newnote, './db/db.json');

    const response = {
      status: 'Success',
      body: newnote,
    };

    res.json(response);
   } else {
     res.json('Error creating new note');
   }
});


//This takes the data and then writes to the JSON file given a destination and some content which will then either log error if error or 'Data written to ${destination}' if it was a success.
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );


//The file is then read and the content gets appended which logs either error if error or will take that content and write to the file.
  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
   };


//This listens for the port when you enter the command 'node server' into the terminal and then will display the message 'App listening at http://localhost:${PORT}.'
app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);