import { Router } from 'express';
import { AuthController } from '@root/modules/auth/AuthController.js';
import AuthValidator from '@root/modules/auth/validation.js';

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/register',
      AuthValidator.getRegisterValidator(),
      AuthController.register
    );

    this.router.post(
      '/login',
      AuthValidator.getLoginValidator(),
      AuthController.login
    );
  }
}

export { AuthRoutes };
