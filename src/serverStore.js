import { friendsUpdateHandler } from '@root/socketHandlers/updates/friends.js';
import { directChatHistoryHandler } from '@root/socketHandlers/directChatHistory.js';
import { directMessageHandler } from '@root/socketHandlers/directMessageHandler.js';
import { roomCreateHandler } from '@root/socketHandlers/roomCreateHandler.js';
import { disconnectHandler } from '@root/socketHandlers/disconnectHandler.js';

import { v4 } from 'uuid';

class ConnectedUsersManager {
  constructor() {
    this.connectedUsers = new Map();
    this.activeRooms = [];
    // console.log('Connecting to', this.connectedUsers);
  }

  async addNewConnectedUser({ socketId, userId }) {
    this.connectedUsers.set(socketId, { userId });

    await friendsUpdateHandler.updateFriendsPendingInvitations(userId);

    const friendsList = await friendsUpdateHandler.updateFriends(userId);

    let activeRooms = this.getActiveRooms();

    // only return only active rooms for your friend
    activeRooms = activeRooms.filter((activeRoom) => {
      const friendIds = friendsList.map((friend) => friend.id.toString());
      return friendIds.includes(activeRoom.roomCreator.userId);
    });

    setTimeout(() => activeRooms, [500]);

    console.log('friendsList come from connection', friendsList);

    console.log('activeRooms', activeRooms);

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

    // console.log('onlineUsers', onlineUsers);
    return onlineUsers;
  }

  addNewActiveRoom(userId, socketId) {
    const newActiveRoom = {
      roomCreator: {
        userId,
        socketId,
      },

      participants: [
        {
          userId,
          socketId,
        },
      ],

      roomId: v4(),
    };

    this.activeRooms = [...this.activeRooms, newActiveRoom];

    return newActiveRoom;
  }

  getActiveRooms() {
    return [
      // {
      //   roomCreator: {
      //     userId: '6577625227200443bfc97ac2',
      //     socketId: 'WTNjsoSRYKtu7ewKAAAB',
      //   },
      //   participants: [],
      //   roomId: 'cff1b90f-d950-4b87-bf54-389857a13dd2',
      // },

      ...this.activeRooms,
    ];
  }

  async getActiveRoom(roomId) {
    const activeRoom = this.activeRooms.filter((room) => {
      return room.roomId === roomId;
    });

    return activeRoom.length > 0 ? activeRoom[0] : null;
  }

  async disconnectHandler(socket) {
    disconnectHandler.disconnect(socket);
  }

  directMessage(socket) {
    socket.on('direct-message', (data) => {
      // console.log('data', data);
      directMessageHandler.directMessage(socket, data);
    });
  }

  directChatHistory(socket) {
    socket.on('direct-chat-history', (data) => {
      // console.log('data14', data);

      directChatHistoryHandler.directChatHistory(socket, data);
    });
  }

  roomCreateHandler(socket) {
    socket.on('room-create', () => {
      roomCreateHandler.roomCreate(socket);
    });
  }

  joinRoomHandler(socket) {
    socket.on('join-room', (data) => {
      roomCreateHandler.joinRoom(socket, data);
    });
  }

  leaveRoomHandler(socket) {
    socket.on('leave-room', (data) => {
      roomCreateHandler.leaveRoom(socket, data);
    });
  }

  roomInitialize(socket) {
    socket.on('conn-init', (data) => {
      roomCreateHandler.roomInitialize(socket, data);
    });
  }

  connSignal(socket) {
    socket.on('conn-signal', (data) => {
      roomCreateHandler.connSignal(socket, data);
    });
  }
}

const connectedUsersManager = new ConnectedUsersManager();

export { connectedUsersManager };
