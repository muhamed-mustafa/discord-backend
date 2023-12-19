import { Server } from 'socket.io';
import TokenVerifierSocket from '@root/middlewares/authSocket.js';
import { ConnectionManager } from '@root/socketHandlers/connectionHandler.js';

class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.connectionManager = new ConnectionManager(this.io);

    this.emitOnlineUsers = () => {
      const onlineUsers = this.connectionManager.getOnlineIUsers();

      this.io.emit('online-users', { onlineUsers });
    };

    this.io.use((socket, next) => {
      TokenVerifierSocket.verifyTokenSocket(socket, next);

      this.connectionManager.handleNewConnection(socket);

      this.connectionManager.directMessage(socket);

      this.connectionManager.directChatHistory(socket);
            
      this.connectionManager.roomCreateHandler(socket);

      this.connectionManager.joinRoomHandler(socket);

      this.connectionManager.leaveRoomHandler(socket);

      socket.on('disconnect', () => {
        // this.connectionManager.handleRemoveConnection(socket);
        this.connectionManager.disconnectHandler(socket);
      });
    });

    this.io.on('connection', this.handleConnection.bind(this));

    setInterval(() => {
      this.emitOnlineUsers();
    }, 1000 * 8);
  }

  handleConnection(socket) {
    this.emitOnlineUsers();
    console.log('Connection', socket.id);
  }
}

export { SocketServer };
