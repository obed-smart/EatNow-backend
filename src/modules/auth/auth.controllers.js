import AppError from '../../utils/appErrors.js';
import catchAsync from '../../utils/catchAsync.js';
import logger from '../../utils/logger.js';
import AuthService from './auth.services.js';

export default class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = catchAsync(async (req, res) => {
    logger.info('Registering user endpoint hit');

    await this.authService.createUser(req.body);

    logger.debug('User created successfully');
    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
    });
  });

  login = catchAsync(async (req, res) => {
    logger.info('Login user endpoint hit');
    const { email, password } = req.body;

    const deviceId = req.cookies?.deviceId || crypto.randomUUID();

    if (!req.cookies?.deviceId) {
      res.cookie('deviceId', deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    const result = await this.authService.login(email, password, {
      deviceId,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.debug('User logged in successfully');

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  });

  logout = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const deviceId = req.cookies.deviceId;

    if (!deviceId) {
      return res.status(200).json({
        status: 'success',
        message: 'Already logged out',
      });
    }

    await this.authService.logoutCurrentDevice(userId, deviceId);

    res.clearCookie('deviceId');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    logger.debug('User logged out successfully');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  });

  logoutAllDevices = catchAsync(async (req, res) => {
    const userId = req.user.id;

    await this.authService.logoutAll(userId);

    logger.debug('Users logged out successfully');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  });

  refreshTokenController = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.cookies.deviceId;

    if (!deviceId || !refreshToken) {
      logger.warn('Device ID or Refresh Token not found');
      throw new AppError('Device ID or Refresh Token not found', 404);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokenService(userId, refreshToken, {});

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.debug('User refreshed token successfully');

    res.status(200).json({
      status: true,
      message: 'Token refreshed successfully',
      accessToken: accessToken,
    });
  });

  forgotPasswordController = catchAsync(async (req, res) => {
    const { email } = req.body;

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password`;

    await this.authService.forgotPasswordService(email, resetUrl);

    res.status(200).json({
      status: true,
      message: 'Password reset email sent successfully',
    });
  });

  resetPasswordController = catchAsync(async (req, res) => {
    const { password } = req.body;

    await this.authService.resetPasswordService(req.params.token, password);

    logger.debug(req.params.token);

    res.status(200).json({
      status: true,
      message: 'Password reset successfully',
    });
  });


}
