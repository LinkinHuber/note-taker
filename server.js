const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html')),
);


app.get('/api/notes', (req, res) =>
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
    console.error(err)
    } else {
     return console.log(data),
     res.json(JSON.parse(data))
    }
}));


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add new note`);
  const { title, text } = req.body;
  if (title && text) {
    const newnote = {
      title,
      text,
      note_id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    };

    readAndAppend(newnote, './db/db.json');

    const response = {
      status: 'success',
      body: newnote,
    };

    res.json(response);
  } else {
    res.json('Error creating new note');
  }
});


const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );


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


app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);