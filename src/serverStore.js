import { friendsUpdateHandler } from '@root/socketHandlers/updates/friends.js';

class ConnectedUsersManager {
  constructor() {
    this.connectedUsers = new Map();
    console.log('Connecting to', this.connectedUsers);
  }

  async addNewConnectedUser({ socketId, userId }) {
    this.connectedUsers.set(socketId, { userId });

    await friendsUpdateHandler.updateFriendsPendingInvitations(userId);

    console.log('Connected to', this.connectedUsers);
  }

  removeConnectedUser(socketId) {
    if (this.connectedUsers.has(socketId)) this.connectedUsers.delete(socketId);
    console.log('disconnect', this.connectedUsers);
  }

  getActiveConnections(userId) {
    const activeConnections = [];

    this.connectedUsers.forEach((value, key) => {
      console.log('key', key);

      if (userId === value.userId) {
        activeConnections.push(key);
      }
    });

    return activeConnections;
  }
}

const connectedUsersManager = new ConnectedUsersManager();

export { connectedUsersManager };
