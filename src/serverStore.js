import { friendsUpdateHandler } from '@root/socketHandlers/updates/friends.js';
import { directChatHistoryHandler } from '@root/socketHandlers/directChatHistory.js';
import { directMessageHandler } from '@root/socketHandlers/directMessageHandler.js';

class ConnectedUsersManager {
  constructor() {
    this.connectedUsers = new Map();
    console.log('Connecting to', this.connectedUsers);
  }

  async addNewConnectedUser({ socketId, userId }) {
    this.connectedUsers.set(socketId, { userId });

    await friendsUpdateHandler.updateFriendsPendingInvitations(userId);

    await friendsUpdateHandler.updateFriends(userId);

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

  getOnlineUsers() {
    const onlineUsers = [];

    this.connectedUsers.forEach((value, key) => {
      onlineUsers.push({ socketId: key, userId: value.userId });
    });

    console.log('onlineUsers', onlineUsers);
    return onlineUsers;
  }

  directMessage(socket) {
    socket.on('direct-message', (data) => {
      console.log('data', data);
      directMessageHandler.directMessage(socket, data);
    });
  }

  directChatHistory(socket) {
    socket.on('direct-chat-history', (data) => {
      console.log('data14', data);

      directChatHistoryHandler.directChatHistory(socket, data);
    });
  }
}

const connectedUsersManager = new ConnectedUsersManager();

export { connectedUsersManager };
