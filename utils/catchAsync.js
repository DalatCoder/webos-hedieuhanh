const catchAsync = asyncMiddlewareFunction => {
  // return middleware function to express to call
  return (req, res, next) => {
    // execute the async function to catch if there's any exception throwed
    // if error, send it to global error handler, call next(err)
    asyncMiddlewareFunction(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
