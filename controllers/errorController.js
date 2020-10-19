const AppError = require('../utils/AppError')

const handlePathDoesNotExist = ({path}) => {
  return new AppError(`Path: '${path} does not exist.`, 400);
}

const handleDirectoryPermission = ({path}) => {
  return new AppError(`User do not have permission to read directory at: '${path}'.`, 400);
}

const responseError = (err, req, res) => {
  // Only send the error that we have known
  // For other unexpected errors, just send genenal error message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR: 💥', err); // Log the error for fixing later

    res.status(500).json({
      status: 'error',
      message: 'Oops! Something went wrong! :('
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  switch (err.code) {
    case 'ENOENT':
      error = handlePathDoesNotExist(err);
      break;

    case 'EPERM':
      error = handleDirectoryPermission(err);
      break;
    
    case 'EACCES':
      error = handleDirectoryPermission(err);
      break;
    
    default:
      break;
  }

  responseError(error, req, res);
}
