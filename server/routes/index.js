import controllers from '../controllers';
import middleware from '../middleware';

const { authController, userController } = controllers;
const { auth } = middleware;

/**
 * Configures API routes for Express app
 * @param {Object} app
 * @returns {void}
 */
const routes = (app) => {
  /**
   * Landing page for API users.
   * Will eventually serve documentation.
   */
  app.get('/api', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is where the LibreDMS API is hosted');
  });

  /**
   * Routes for user authentication.
   */
  app.post('/api/auth/login', authController.login);
  app.post('/api/auth/logout', authController.logout);

  /**
   * CRUD routes for users
   */
  app
    .route('/api/users')
    .post(auth.checkToken, userController.create);
};

export default routes;
