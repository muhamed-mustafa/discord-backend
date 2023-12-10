// NewConnectionHandler.js
import { connectedUsersManager } from '../serverStore.js';

class ConnectionHandler {
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

export { ConnectionHandler };
