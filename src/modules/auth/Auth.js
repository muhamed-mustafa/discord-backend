import { User } from '@root/modules/user/UserModel.js';
class Auth {
  constructor(params) {
    Object.assign(this, params);
  }

  static async register(req, res) {
    const user = await User.create(req.body);

    const token = await user.getSignedJwtToken(user.email.toLowerCase());

    res.status(201).json({ userDetails: { email: user.email, token: token, username: user.username, _id: user._id } });
  }

  static async login(req,res) {

    const token = await req.user.getSignedJwtToken(req.user.email.toLowerCase());

    res.status(200).json({ userDetails: { email: req.user.email, token, username: req.user.username, _id: req.user._id } });
  }
  
}

export default Auth;
