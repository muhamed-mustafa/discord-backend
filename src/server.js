import { Application } from './app.js';

class Server {
  constructor() {
    this.app = new Application();
  }

  start() {
    this.app.start();
  }
}

const server = new Server();
server.start();
