import { connectedUsersManager } from '../serverStore.js';

class ConnectionManager {
  constructor(io) {
    this.io = io;
  }

  handleNewConnection(socket) {
    connectedUsersManager.addNewConnectedUser({
      socketId: socket.id,
      userId: socket.user.userId,
    });
  }

  handleRemoveConnection(socket) {
    connectedUsersManager.removeConnectedUser(socket.id);
  }

  getOnlineIUsers() {
    connectedUsersManager.getOnlineUsers();
  }

  directMessage(socket) {
    connectedUsersManager.directMessage(socket);
  }

  directChatHistory(socket) {
    connectedUsersManager.directChatHistory(socket);
  }

  roomCreateHandler(socket) {
    connectedUsersManager.roomCreateHandler(socket);
  }

  joinRoomHandler(socket) {
    connectedUsersManager.joinRoomHandler(socket);
  }

  leaveRoomHandler(socket) {
    connectedUsersManager.leaveRoomHandler(socket);
  }
  
  roomInitialize(socket) {
    connectedUsersManager.roomInitialize(socket);
  }

  connSignal(socket) {
    connectedUsersManager.connSignal(socket);
  }

  disconnectHandler(socket) {
    connectedUsersManager.disconnectHandler(socket);
  }
}

export { ConnectionManager };
