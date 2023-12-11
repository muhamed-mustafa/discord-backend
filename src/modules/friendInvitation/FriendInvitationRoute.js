import { Router } from 'express';
import { FriendInvitationController } from '@root/modules/friendInvitation/FriendInvitationController.js';
import { FriendValidator } from '@root/modules/friendInvitation/validation.js';
import TokenVerifier from '@root/middlewares/auth.js';

class FriendInvitationRoutes {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      '/',
      TokenVerifier.verifyToken,
      FriendValidator.getValidationChain(FriendValidator.addFriendValidation()),
      FriendInvitationController.postInvite
    );
  }
}

export { FriendInvitationRoutes };
