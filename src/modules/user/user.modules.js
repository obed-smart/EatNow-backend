import UserRepository from './user.repository.js';
import UserService from './user.services.js';
import UserController from './user.controllers.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default userController;
