import jwt from 'jsonwebtoken';
import AppError from '../utils/appErrors.js';
import catchAsync from '../utils/catchAsync.js';

const authenticateUser = catchAsync(async (req, res, next) => {
       let token;

       console.log(req.headers.authorization);

       if (
              req.headers.authorization &&
              req.headers.authorization.startsWith('Bearer')
       ) {
              token = req.headers.authorization.split(' ')[1];
              console.log(token);
       }

       if (!token || !req.cookies.accessToken) {
              throw new AppError(
                     'You are not logged in! Please log in to get access.',
                     401,
              );
       }

       const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

       console.log(decoded);

       req.user = {
              id: decoded.id,
              role: decoded.role,
       };
       
       console.log(req.user);      
       next();
});

const restrictTo = (...roles) => {
       return (req, res, next) => {
              if (!roles.includes(req.user.role)) {
                     throw new AppError(
                            'You do not have permission to perform this action',
                            401,
                     );
              }
              next();
       };
};

export default {
       authenticateUser,
       restrictTo,
};
