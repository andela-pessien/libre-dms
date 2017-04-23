import controllers from '../controllers';
import middleware from '../middleware';

const { authController, userController, documentController } = controllers;
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
  app
    .route('/api/users/:id')
    .get(auth.checkToken, userController.retrieve)
    .put(auth.checkToken, auth.hasAccess, userController.update)
    .delete(auth.checkToken, auth.hasAccess, userController.destroy);

  /**
   * CRUD routes for documents
   */
  app
    .route('/api/documents')
    .post(auth.checkToken, documentController.create);
  app
    .route('/api/documents/:id')
    .get(auth.checkToken, auth.hasAccess, documentController.retrieve);
};

export default routes;
