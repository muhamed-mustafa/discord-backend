import { User } from '@root/modules/user/UserModel.js';
import { ErrorResponse } from '@root/utils/errorResponse.js';

class Auth {
  constructor(params) {
    Object.assign(this, params);
  }

  static async register(req, res) {
    const { username, mail, password } = req;

    let user = await User.findOne({ mail: mail.toLowerCase() });

    if (user) throw new ErrorResponse(i18n.__('EmailAlreadyExists'), 409);

    user = await User.create({ username, mail: mail.toLowerCase(), password });

    const token = await user.getSignedJwtToken(mail.toLowerCase());

    res.status(201).json({ userDetails: { mail: user.mail, token: token, username: user.username, _id: user._id } });
  }

  static async login(req,res) {
    const { mail,password } = req;

    const user = await User.findOne({ mail : mail.toLowerCase() });

    if (user && (await user.comparePassword(password)))
    throw new ErrorResponse(i18n.__('InvalidCredentials'), 409);

    const token = await user.getSignedJwtToken(mail.toLowerCase());

    res.status(200).json({ userDetails: { mail: user.mail, token: token, username: user.username, _id: user._id } });
  }
  
}

export default Auth;
