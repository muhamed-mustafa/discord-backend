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

    console.log('roomDetails', roomDetails);

    socket.emit('room-create', {
      roomDetails,
    });

    this.updateRooms.updateRooms();
  }

  async joinRoom(socket, data) {
    const { roomId } = data;

    const participantDetails = {
      userId: socket.user.userId,
      socketId: socket.id,
    };

    const roomDetails = await connectedUsersManager.getActiveRoom(roomId);

    console.log('roomDetails', roomDetails);

    const activeRooms = connectedUsersManager
      .getActiveRooms()
      .filter((activeRoom) => activeRoom.roomId !== roomId);

    const updateRoom = {
      ...roomDetails,
      participants: [...roomDetails.participants, participantDetails],
    };

    activeRooms.push(updateRoom);

    console.log('activeRooms after update', activeRooms);

    console.log('joinSuccessfully');

    console.log('getActiveRooms', await connectedUsersManager.getActiveRooms());

    this.updateRooms.updateRooms(activeRooms);
  }

  async leaveRoom(socket, data) {
    try {
      const { roomId } = data;

      let roomDetails = await connectedUsersManager.getActiveRoom(roomId);

      console.log('roomDetails', roomDetails);

      roomDetails.participants = roomDetails.participants.filter(
        (participant) => participant.socketId !== socket.id
      );

      const activeRooms = connectedUsersManager
        .getActiveRooms()
        .filter((activeRoom) => activeRoom.roomId !== roomId);

      const updateRoom = {
        ...roomDetails,
        participants: [...roomDetails.participants],
      };

      activeRooms.push(updateRoom);

      console.log('activeRooms after update leave', activeRooms);

      console.log('leaveSuccessfully');

      this.updateRooms.updateRooms(activeRooms);
    } catch (error) {
      console.log('error', error);
    }
  }
}

const roomCreateHandler = new RoomCreateHandler();

export { roomCreateHandler };
