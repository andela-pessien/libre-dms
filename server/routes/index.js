import controllers from '../controllers';
import middleware from '../middleware';

const {
  authController,
  userController,
  documentController,
  rolesController
} = controllers;
const { auth, database, list } = middleware;

/**
 * Configures API routes for Express app
 * @param {Object} app
 * @returns {void}
 */
const routes = (app) => {
  /**
   * Landing page for API users.
   * Serves documentation.
   */
  app.get('/api', (req, res) => {
    res.redirect('https://andela-pessien.github.io/libredms-apidocs');
  });

  /**
   * Routes for user authentication.
   */
  app.post('/api/auth/login', authController.login);
  app.post('/api/auth/logout', auth.checkToken, authController.logout);

  /**
   * CRUD routes for users
   */
  app
    .route('/api/users')
    .post(userController.create)
    .get(
      auth.checkToken,
      list.setOptions,
      userController.list
    );
  app
    .route('/api/users/:id')
    .get(auth.checkToken, userController.retrieve)
    .put(
      auth.checkToken,
      database.retrieveRecord,
      auth.ownerAccess,
      database.noIDChange,
      userController.update
    )
    .delete(
      auth.checkToken,
      database.retrieveRecord,
      auth.hasAccess,
      userController.destroy
    );
  /**
   * Route for setting a user's role
   */
  app.put(
    '/api/users/set-role/:id',
    auth.checkToken,
    auth.adminAccess,
    database.retrieveRecord,
    userController.setRole
  );

  /**
   * CRUD routes for documents
   */
  app
    .route('/api/documents')
    .post(auth.checkToken, documentController.create)
    .get(auth.checkToken, list.setOptions, documentController.list);
  app
    .route('/api/documents/:id')
    .get(
      auth.checkToken,
      database.retrieveRecord,
      auth.hasAccess,
      documentController.retrieve
    )
    .put(
      auth.checkToken,
      database.retrieveRecord,
      auth.ownerAccess,
      database.noIDChange,
      documentController.update
    )
    .delete(
      auth.checkToken,
      database.retrieveRecord,
      auth.hasAccess,
      documentController.destroy
    );
  app.get(
    '/api/users/:id/documents',
    auth.checkToken,
    list.setOptions,
    documentController.listByUser
  );

  /**
   * Search routes
   */
  app.get(
    '/api/search/users',
    auth.checkToken,
    list.setOptions,
    userController.search
  );
  app.get(
    '/api/search/documents',
    auth.checkToken,
    list.setOptions,
    documentController.search
  );

  /**
   * Routes for retrieving roles
   */
  app.get('/api/roles', rolesController.list);
  app.get('/api/roles/:id', database.retrieveRecord, rolesController.retrieve);
};

export default routes;
