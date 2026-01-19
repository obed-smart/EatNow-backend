import express from 'express';
import authController from './auth.modules.js';
import AuthGuard from '../../middlewares/auth.middleware.js';
import validateMiddleware from '../../middlewares/validate.middleware.js';
import {
       loginDto,
       registerDto,
       forgotPasswordDto,
       resetPasswordDto,
} from './auth.dto.js';

const router = express.Router();

router.post(
       '/signup',
       validateMiddleware(registerDto),
       authController.register,
);
router.post('/login', validateMiddleware(loginDto), authController.login);
router.get('/logout', AuthGuard.authenticateUser, authController.logout);
router.get(
       '/logout-all',
       AuthGuard.authenticateUser,
       authController.logoutAllDevices,
);
router.post(
       '/refresh-token',
       AuthGuard.authenticateUser,
       authController.refreshTokenController,
);

router.post(
       '/forgot-password',
       validateMiddleware(forgotPasswordDto),
       authController.forgotPasswordController,
);
router.patch(
       '/reset-password/:token',
       validateMiddleware(resetPasswordDto),
       authController.resetPasswordController,
);

export default router;
