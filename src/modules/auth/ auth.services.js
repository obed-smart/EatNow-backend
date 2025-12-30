import AuthRepository from "./auth.repository";

export default class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  }
