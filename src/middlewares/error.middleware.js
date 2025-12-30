const sendErrorDev = (err, res) => {
       res.status(err.statusCode).json({
              status: err.status,
              message: err.message,
              stack: err.stack,
       });
};

const sendErrorProd = (err, res) => {
       if (err.isOperational) {
              return res.status(err.statusCode).json({
                     status: err.status,
                     message: err.message,
              });
       }
};

const errorMiddleware = (err, req, res, next) => {
       err.statusCode = err.statusCode || 500;
       err.status = err.status || 'error';

       if (process.env.NODE_ENV === 'development') {
              sendErrorDev(err, res);
       } else {
              sendErrorProd(err, res);
       }
};

export default errorMiddleware;