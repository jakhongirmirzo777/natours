class AppError extends Error {
  constructor(message, statusCode, validation = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.validation = validation;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
