import AppError from '../../utils/appErrors.js';
import logger from '../../utils/logger.js';
import crypto from 'crypto';
import AuthRepository from './auth.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from '../../utils/generate.js';

import { sendEmail } from '../../utils/email.js';
import { passwordResetHTML } from '../../utils/generate.js';

export default class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async createUser(userData) {
    let user = await this.authRepository.getUserByEmail(userData.email);

    if (user) {
      logger.warn('User already exists', userData.email);
      throw new AppError('User already exists', 409);
    }
    await this.authRepository.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      credentials: [
        {
          authMode: 'password',
        },
      ],
    });
    return;
  }

  async login(email, password, context) {
    const user = await this.authRepository.getUserByEmail(
      email,
      '+credentials.password +isActive +role',
    );

    if (!user || !user.isActive) {
      logger.warn('Invalid credentials', email);
      throw new AppError('Invalid credentials', 401);
    }

    if (!(await user.comparePassword(password))) {
      logger.warn('Invalid credentials', email);
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = await this.createUserSession(
      user.id,
      context.deviceId,
      context.userAgent,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logoutCurrentDevice(userId, deviceId) {
    await this.authRepository.revokeByDevice(userId, deviceId);
  }

  async logoutAll(userId) {
    await this.authRepository.revokeAllByUserId(userId);
  }

  async createUserSession(userId, deviceId, userAgent) {
    await this.authRepository.revokeByDevice(userId, deviceId);

    const refreshToken = generateRefreshToken();

    const hashedRefreshToken = hashToken(refreshToken);

    await this.authRepository.createUserSession({
      userId,
      deviceId,
      userAgent,
      refreshToken: hashedRefreshToken,
      lastUsedAt: new Date(),
    });

    return refreshToken;
  }

  async refreshTokenService(userId, refreshToken, context) {
    const session =
      await this.authRepository.findSessionByRefreshToken(refreshToken);

    if (!session || session.revokedAt) {
      logger.error('Invalid or expired refresh token. Kindly login again.');
      throw new Error('Invalid or expired refresh token. Kindly login again.');
    }

    await this.authRepository.revokeSession(refreshToken);

    const newAccessToken = generateAccessToken(user);

    const newRefreshToken = await this.createUserSession(
      userId,
      context.deviceId,
      context.userAgent,
    );

    return { newAccessToken, newRefreshToken };
  }

  async forgotPasswordService(email, resetURL) {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = user.createPasswordResetToken();

    await this.authRepository.save(user, false);

    const fullResetURL = `${resetURL}/${resetToken}`;

    logger.debug(resetToken);

    logger.debug('done');

    // await this.sendPasswordResetEmail(user, fullResetURL);
  }

  async resetPasswordService(token, password) {
    logger.debug('Reset password service called');
    const hashResetToken = hashToken(token);

    const user =
      await this.authRepository.findUserByValidResetToken(hashResetToken);

    if (!user) {
      throw new AppError('Invalid or expired token', 400);
    }

    if (await user.comparePassword(password)) {
      throw new AppError('New password cannot be the same as the old one', 400);
    }

    user.password = password;
    user.credentials.passwordResetToken = undefined;
    user.credentials.passwordResetExpires = undefined;
    await this.authRepository.revokeAllByUserId(user.id);
    await this.authRepository.save(user, false);
  }

  /**
   * send email to the user
   * @param {Object} user - User object
   * @param {string} resetURL - URL for password reset
   */

  async sendPasswordResetEmail(user, resetURL) {
    try {
      logger.info('Sending password reset email');
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 5 min)',
        text: `You requested a password reset.\n
                            Use the link below to set a new password:
                            ${resetURL}\n
                            If you did not request this, please ignore this email.`,
        html: passwordResetHTML(resetURL),
      });
    } catch (error) {
      user.credentials.passwordResetToken = undefined;
      user.credentials.passwordResetExpires = undefined;
      await this.authRepository.saveUser(user, false);

      logger.error('Failed to send email', error);
      throw new AppError('There was an error sending the email', 500);
    }
  }

  async updateMe(userId, userData) {
    await this.authRepository.updateMe(userId, userData);
  }
}
