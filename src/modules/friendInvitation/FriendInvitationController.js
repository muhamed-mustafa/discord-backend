import FriendInvitation from './FriendInvitation.js';
import asyncHandler from 'express-async-handler';

class FriendInvitationController {
  static postInvite = asyncHandler(async (req, res,next) => {
    FriendInvitation.postInvite(req, res,next);
  });

}

export { FriendInvitationController };
