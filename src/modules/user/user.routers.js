import express from 'express';

import UserController from './user.modules.js';
import AuthGaurd from '../../middlewares/auth.middleware.js';
import validateMiddleware from '../../middlewares/validate.middleware.js';
import { updateUserDto } from './user.dtos.js';

const router = express.Router();

router.patch(
  'updateMe',
  AuthGaurd.authenticateUser,
  validateMiddleware(updateUserDto),
  UserController.updateMe,
);

export default router;
