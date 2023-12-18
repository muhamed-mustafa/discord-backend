import { connectedUsersManager } from '../serverStore.js';
import { UpdateRooms } from './updates/rooms.js';

class RoomCreateHandler {
  constructor() {
    this.updateRooms = new UpdateRooms();
  }

  async roomCreate(socket) {
    const {
      id: socketId,
      user: { userId },
    } = socket;

    const roomDetails = connectedUsersManager.addNewActiveRoom(
      userId,
      socketId
    );

    socket.emit('room-create', {
      roomDetails,
    });

    this.updateRooms.updateRooms();
  }
}

const roomCreateHandler = new RoomCreateHandler();

export { roomCreateHandler };
