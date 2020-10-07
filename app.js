const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement CORS | Allow everyone for consume API
app.use(cors());

// Implement CORS for complex request (PUT PATCH DELETE)
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/', (req, res) => {
  res.send(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use('/api/directory', require('./routes/directory'));
app.use('/api/file', require('./routes/file'));

module.exports = app;
