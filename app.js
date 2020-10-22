const express = require('express');
const cors = require('cors');
const path = require('path');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement CORS | Allow everyone for consume API
app.use(cors());

// Implement CORS for complex request (PUT PATCH DELETE)
app.options('*', cors());

app.use('/', require('./routes/view'))
app.use('/api/directory', require('./routes/directory'));
app.use('/api/file', require('./routes/file'));

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
