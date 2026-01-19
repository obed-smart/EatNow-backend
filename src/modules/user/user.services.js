export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async updateMe(userId, userData) {
    await this.userRepository.updateMe(userId, userData);
  }
}
