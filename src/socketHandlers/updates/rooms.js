import { connectedUsersManager } from '../../serverStore.js';
import { SocketServer } from '../../socketServer.js';

class UpdateRooms {
  constructor() {
    this.socketServer = new SocketServer();
  }

  async updateRooms(activeRooms, toSpecifiedSocketId = null) {
    if (toSpecifiedSocketId)
      return this.socketServer.io(toSpecifiedSocketId).emit('active-rooms', {
        activeRooms: connectedUsersManager.getActiveRooms(),
      });

    console.log('activeRooms aa', activeRooms);

    this.socketServer.io.emit('active-rooms', {
      activeRooms: activeRooms || connectedUsersManager.getActiveRooms,
    });
  }
}

export { UpdateRooms };
