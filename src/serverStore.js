class ConnectedUsersManager {
  constructor() {
    this.connectedUsers = new Map();
    console.log('Connecting to', this.connectedUsers);
  }

  addNewConnectedUser({ socketId, userId }) {
    this.connectedUsers.set(socketId, { userId });
    console.log('Connected to', this.connectedUsers);
  }

  removeConnectedUser(socketId) {
    if (this.connectedUsers.has(socketId)) this.connectedUsers.delete(socketId);
    console.log('disconnect', this.connectedUsers);
  }
}

const connectedUsersManager = new ConnectedUsersManager();

export { connectedUsersManager };
