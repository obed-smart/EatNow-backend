import AuthRepository from './auth.repository.js';
import AuthController from './auth.controllers.js';
import AuthService from './auth.services.js';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export default authController;
