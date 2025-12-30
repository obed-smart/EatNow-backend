import AppError from '../../utils/appErrors';
import catchAsync from '../../utils/catchAsync';
import AuthService from './ auth.services.js';

const authService = new AuthService();

export const register = catchAsync(async (req, res) => {
       
});

export const login = catchAsync(async (req, res) => {
       throw new AppError('User login failed', 400);
});
