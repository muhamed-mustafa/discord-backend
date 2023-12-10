import { Server } from 'socket.io';
import TokenVerifierSocket from '@root/middlewares/authSocket.js';
import { ConnectionHandler } from '@root/socketHandlers/connectionHandler.js';

class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.connectionHandler = new ConnectionHandler(this.io);

    this.io.use((socket, next) => {
      TokenVerifierSocket.verifyTokenSocket(socket, next);

      this.connectionHandler.handleNewConnection(socket);

      socket.on('disconnect', () => {
        this.connectionHandler.handleRemoveConnection(socket);
      });
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    console.log('Connection', socket.id);
  }
}

export { SocketServer };
