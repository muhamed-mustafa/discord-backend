import { connectedUsersManager } from '../serverStore.js';
import { roomCreateHandler } from './roomCreateHandler.js';

class DisconnectHandler {
  async disconnect(socket) {
    const activeRooms = connectedUsersManager.getActiveRooms();

    console.log('activeRooms', activeRooms);

    activeRooms.forEach((activeRoom) => {
      console.log('1', Array.isArray(activeRoom.participants));

      const userInRoom = activeRoom.participants?.some(
        (participant) => participant.socketId !== socket.id
      );

      if (userInRoom) {
        console.log('userInRoom', userInRoom);
        roomCreateHandler.leaveRoom(socket, { roomId: activeRoom.roomId });
      }
    });

    connectedUsersManager.removeConnectedUser(socket.id);
  }
}

const disconnectHandler = new DisconnectHandler();

export { disconnectHandler };
