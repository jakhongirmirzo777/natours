const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name} is. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const message = 'Validation error';
  const fields = Object.entries(err.errors);
  const validation = fields.reduce((acc, [key, val]) => {
    acc[key] = [val.message];
    return acc;
  }, {});
  return new AppError(message, 400, validation);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      if (Object.keys(err.validation).length) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          validation: err.validation,
        });
      }

      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: don't leak error details
    }

    return res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!',
    });
  }

  // b) RENDERED WEBSITE
  // eslint-disable-next-line no-lonely-if
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastErrorDb(err);
    } else if (err.code === 11000) {
      err = handleDuplicateFieldsDb(err);
    } else if (err.name === 'ValidationError') {
      err = handleValidationErrorDb(err);
    } else if (err.name === 'JsonWebTokenError') {
      err = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      err = handleJWTExpiredError();
    }
    sendErrorProd(err, req, res);
  }
};
