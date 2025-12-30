import AppError from '../../utils/appErrors';
import AuthRepository from './auth.repository';

export default class AuthService {
       constructor() {
              this.authRepository = new AuthRepository();
       }

       createUser = catchAsync(async (userData) => {
              let user = await this.authRepository.getUserByEmail(
                     userData.email,
              );
              if (user) {
                     throw new AppError('User already exists', 409);
              }

              user = await this.authRepository.createUser(userData);
              return user;
       });

       login = catchAsync(async (email, password) => {
              if (!email || !password) {
                     throw new AppError('Email and password are required', 400);
              }

              const user = await this.authRepository.getUserByEmail(
                     email,
                     '+password',
              );

              if (!user) {
                     throw new AppError('User not found', 404);
              }

              if (!(await user.comparePassword(password))) {
                     throw new AppError('Incorrect password', 401);
              }
              return user;
       });
}
