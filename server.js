const express = require('express');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const path = require('path');
//

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);