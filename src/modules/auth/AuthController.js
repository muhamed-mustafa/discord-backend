import Auth from './Auth.js';
import asyncHandler from 'express-async-handler';

class AuthController {
  static register = asyncHandler(async (req, res) => {
    Auth.register(req, res);
  });

  static login = asyncHandler(async (req, res) => {
    Auth.login(req, res);
  });
}

export { AuthController };
