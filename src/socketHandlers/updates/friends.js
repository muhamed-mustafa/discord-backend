import { User } from '@root/modules/user/UserModel.js';
import { FriendInvitation } from '@root/modules/friendInvitation/FriendInvitationModel.js';
import { connectedUsersManager } from '../../serverStore.js';
import { ConnectionManager } from '../connectionHandler.js';
import { SocketServer } from '../../socketServer.js';

class FriendsUpdateHandler {
  constructor() {
    this.socketServer = new SocketServer();
    this.connectionManager = new ConnectionManager();
  }

  async updateFriendsPendingInvitations(userId) {
    console.log('userId', userId);
    const pendingInvitations = await FriendInvitation.findOne({
      receiver: userId,
    }).populate('sender', '_id username email');

    const receivers = connectedUsersManager.getActiveConnections(userId);

    console.log('receivers', receivers);
    console.log('pendingInvitations22', pendingInvitations);

    receivers.forEach((receiverSocketId) => {
      console.log('pendingInvitations14', pendingInvitations);
      this.sendFriendInvitations(receiverSocketId, pendingInvitations);
    });
  }

  sendFriendInvitations(receiverSocketId, pendingInvitations) {
    this.socketServer.io.to(receiverSocketId).emit('friend-Invitations', {
      pendingInvitations: pendingInvitations ? pendingInvitations : [],
    });
  }
}

const friendsUpdateHandler = new FriendsUpdateHandler();

export { friendsUpdateHandler };
