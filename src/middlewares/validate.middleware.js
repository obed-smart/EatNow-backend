import AppError from '../utils/appErrors.js';

export default (schema) => (req, res, next) => {
       const { error, value } = schema.validate(req.body, {
              abortEarly: false,
       });
       if (error) {
              const message = error.details
                     .map((detail) => detail.message)
                     .join(', ');
              next(new AppError(message, 400));
       }
       req.body = value;
       next();
};
