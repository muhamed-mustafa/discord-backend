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

    this.io.use((socket, next) => {
      TokenVerifierSocket.verifyTokenSocket(socket, next);

      this.connectionManager.handleNewConnection(socket);

      socket.on('disconnect', () => {
        this.connectionManager.handleRemoveConnection(socket);
      });
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    console.log('Connection', socket.id);
  }
}

export { SocketServer };
