import jwt from 'jsonwebtoken';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import i18n from 'i18n';

class TokenVerifier {
  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
  }

  verifyToken(req, _res, next) {
    let token = req.headers.authorization.split(' ')[1];
    
    if (!token) throw new ErrorResponse(i18n.__('tokenRequired'), 409);

    try {
      token = token.replace(/^Bearer\s+/, '');

      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      req.user = decoded;
    } catch (err) {
      throw new ErrorResponse(i18n.__('invalidToken'), 401);
    }

    return next();
  }
}

export default new TokenVerifier();
