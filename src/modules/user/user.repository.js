import User from '../auth/model/user.model.js';

export default class UserRepository {
  updateMe(userId, userData) {
    return User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
  }
}
