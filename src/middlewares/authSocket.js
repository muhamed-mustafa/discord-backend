import jwt from 'jsonwebtoken';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import i18n from 'i18n';

class TokenVerifierSocket {
  constructor() {
    this.verifyTokenSocket = this.verifyTokenSocket.bind(this);
  }

  verifyTokenSocket(socket, next) {
    console.log('socket', socket.handshake);

    const token = socket.handshake?.headers.token;

    try {

      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      console.log('decoded', decoded);

      socket.user = decoded;

      console.log('socket.user', socket.user);
    } 
    
    catch (err) {
      console.log('Failed to verify token', err);
      throw new ErrorResponse(i18n.__('invalidToken'), 401);
    }

    return next();
  }
}

export default new TokenVerifierSocket();
