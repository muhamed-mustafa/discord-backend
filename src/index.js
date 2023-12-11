import { AuthRoutes } from '@root/modules/auth/AuthRoute.js';
import { FriendInvitationRoutes } from '@root/modules/friendInvitation/FriendInvitationRoute.js';

class RouteManager {
  constructor(app) {
    this.app = app;
    this.authRoute = new AuthRoutes();
    this.friendRoute = new FriendInvitationRoutes();
  }

  mountRoutes() {
    this.app.use('/api/v1/auth', this.authRoute.router);
    this.app.use('/api/v1/friendInvitation', this.friendRoute.router);
  }
}

export { RouteManager };
