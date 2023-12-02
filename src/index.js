import { AuthRoutes } from '@root/modules/auth/AuthRoute.js';

class RouteManager {
  constructor(app) {
    this.app = app;
    this.authRoute = new AuthRoutes();
  }

  mountRoutes() {
    this.app.use('/api/v1/auth', this.authRoute.router);
  }
}

export { RouteManager };
