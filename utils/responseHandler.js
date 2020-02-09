const isErrorLoggerEnabled = false;

const error = err => {
  if (isErrorLoggerEnabled) {
    console.log(err);
  }
  return {
    statusCode: err.statusCode ? err.statusCode : 500,
    body: JSON.stringify({
      error: err.name ? err.name : 'Exception',
      message: err.message ? err.message : 'Unknown error'
    })
  };
};

const success = data => {
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

const notFound = () => {
  return error({
    statusCode: 404,
    error: 'Not found',
    message: 'Resource not found'
  });
};

module.exports = {
  error,
  success,
  notFound
};
