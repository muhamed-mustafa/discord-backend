import { FriendInvitation } from '@root/modules/friendInvitation/FriendInvitationModel.js';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import i18n from 'i18n';
import { User } from '@root/modules/user/UserModel.js';
import { friendsUpdateHandler } from '@root/socketHandlers/updates/friends.js';

class FriendInvitationService {
  constructor(params) {
    Object.assign(this, params);
  }

  static async postInvite(req, res,next) {
    const { targetEmailAddress } = req.body;

    const { user }               = req;

    if (user.email.toLowerCase() === targetEmailAddress.toLowerCase()) return next(new ErrorResponse(i18n.__('selfInvitationError'), 400));
    
    const targetUser = await User.findOne({ email: targetEmailAddress.toLowerCase() });

    if (!targetUser) return next(new ErrorResponse(i18n.__('userNotFoundError', { email: targetEmailAddress }), 404));

    if (await FriendInvitation.findOne({ sender: user.userId, receiver: targetUser._id })) return next(new ErrorResponse(i18n.__('friendInvitationExistsError'), 400));
    
    if (targetUser.friends.some(friend => friend.toString() === user.userId.toString()))  return next(new ErrorResponse(i18n.__('friendAlreadyAddedError'), 400));
    
    const newInvitation = await FriendInvitation.create({ sender : user.userId, receiver : targetUser.id });

    friendsUpdateHandler.updateFriendsPendingInvitations(targetUser._id.toString());

    res.status(201).json({ message: i18n.__('invitationCreatedSuccess'),status : 200 });
  }
}

export default FriendInvitationService;
