const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement CORS | Allow everyone for consume API
app.use(cors());

// Implement CORS for complex request (PUT PATCH DELETE)
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/directory', require('./routes/directory'));
app.use('/api/file', require('./routes/file'));

module.exports = app;
