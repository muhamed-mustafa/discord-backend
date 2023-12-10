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
}

export { ConnectionManager };
