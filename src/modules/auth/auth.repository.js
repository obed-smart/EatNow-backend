import User from './model/user.model.js';
import catchAsync from '../../utils/catchAsync.js';
import Session from './model/session.model.js';

export default class AuthRepository {
  createUser(userData) {
    return User.create(userData);
  }

  getUserById(id) {
    return User.findById(id);
  }

  /**
   * find user by valid reset token
   * @param {string} token - reset token
   * @returns {Promise<User>} - user object
   */
  findUserByValidResetToken(token) {
    return User.findOne({
      'credentials.passwordResetToken': token,
    }).select('+password');
  }

  /**
   * save user date
   * @param {User} user - user object
   * @param {boolean} validate - validate user object before saving
   * @returns {Promise<User>} - user object
   */

  save(user, validate = true) {
    if (!validate) {
      return user.save({ validateBeforeSave: false });
    }
    return user.save();
  }

  getUserByEmail(email, select = null) {
    const query = User.findOne({ email });
    if (select) query.select(select);
    return query;
  }

 

  //! USER SESSIONS

  createUserSession(sessionData) {
    return Session.create(sessionData);
  }

  /**
   *  revoke user act session on the current device
   * @param {string} userId - the user id
   * @param {string} deviceId - the device id
   * @returns -
   */
  revokeByDevice(userId, deviceId) {
    return Session.updateMany(
      { userId, deviceId, revokedAt: null },
      { revokedAt: new Date() },
    );
  }

  /**
   * - revoke all the active sessions of a user
   * @param {*} userId - the user id
   * @returns {void}
   */
  revokeAllByUserId(userId) {
    return Session.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() },
    );
  }

  findSessionByRefreshToken(refreshToken) {
    return Session.findOne({ refreshToken });
  }

  revokeSession(refreshToken) {
    return Session.updateOne(
      { refreshToken, revokedAt: null },
      { revokedAt: new Date() },
    );
  }
}
