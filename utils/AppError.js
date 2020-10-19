class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // marks own error operational to distinguish from other unexpected Error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
