import { Server } from 'socket.io';
import TokenVerifierSocket from '@root/middlewares/authSocket.js';
import { ConnectionManager } from '@root/socketHandlers/connectionHandler.js';
import { directChatHistoryHandler } from '@root/socketHandlers/directChatHistory';
import { directMessageHandler } from '@root/socketHandlers/directMessageHandler';

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

      socket.on('direct-message', (data) => {
        directMessageHandler.directMessage(socket, data);
      });

      socket.on('direct-chat-history', (data) => {
        directChatHistoryHandler.directChatHistory(socket, data);
      });

      socket.on('disconnect', () => {
        this.connectionManager.handleRemoveConnection(socket);
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
