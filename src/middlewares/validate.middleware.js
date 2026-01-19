import AppError from '../utils/appErrors.js';

export default (schema) => (req, res, next) => {
       if (req.body === undefined) {
              return next(
                     new AppError(
                            'Request body is required and must be JSON',
                            400,
                     ),
              );
       }
       const { error, value } = schema.validate(req.body, {
              abortEarly: false,
       });

       if (error) {
              const message = error.details
                     .map((detail) => detail.message)
                     .join(', ');
              return next(new AppError(message, 400));
       }

       req.body = value;
       return next();
};
