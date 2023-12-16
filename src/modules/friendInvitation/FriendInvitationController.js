import FriendInvitation from './FriendInvitation.js';
import asyncHandler from 'express-async-handler';

class FriendInvitationController {
  static postInvite = asyncHandler(async (req, res,next) => {
    FriendInvitation.postInvite(req, res,next);
  });

  static postAccept = asyncHandler(async (req, res,next) => {
    FriendInvitation.postAccept(req, res,next);
  });
  static postReject = asyncHandler(async (req, res,next) => {
    FriendInvitation.postReject(req, res,next);
  });

}

export { FriendInvitationController };
