import {
  formatUser,
  signToken,
  dbErrorHandler,
  getMetadata,
  isSuperAdmin,
  isOwner
} from '../helpers';
import model from '../models';

const { User } = model;

export default {
  /**
   * Method that creates a new user
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  create(req, res) {
    if (req.body.name && req.body.email && req.body.password) {
      if (req.body.roleId) {
        return res.status(403).json({
          message: "You're not permitted to specify your own role."
        });
      }
      User.findOne({ where: { email: req.body.email }, paranoid: false })
      .then((user) => {
        if (user) {
          return res.status(403).json({
            message: 'A user with that email already exists'
          });
        }
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          isPrivate: req.body.isPrivate
        })
        .then((newUser) => {
          res.set('x-access-token', signToken(newUser));
          return res.status(201).json(formatUser(newUser));
        })
        .catch(err => (dbErrorHandler(err, res)));
      })
      .catch(err => (dbErrorHandler(err, res)));
    } else {
      return res.status(400).json({
        message: 'Please provide a name, email and password'
      });
    }
  },

  /**
   * Method that lists all users
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  list(req, res) {
    const dbQuery = isSuperAdmin(req) ? {} : {
      $or: [
        { id: req.decoded.id },
        { isPrivate: false }
      ]
    };
    User.findAndCountAll({
      attributes: ['id', 'name'],
      where: dbQuery,
      limit: req.listOptions.limit,
      offset: req.listOptions.offset
    })
    .then((users) => {
      res.set(
        'x-list-metadata',
        getMetadata(
          users,
          req.listOptions.limit,
          req.listOptions.offset
        )
      );
      res.status(200).json(users.rows);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that retrieves a specific user by id
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  retrieve(req, res) {
    User.find({
      attributes: [
        'id',
        'name',
        'email',
        'roleId',
        'isPrivate',
        'organisationId',
        'departmentId',
        'createdAt'
      ],
      where: { id: req.params.id }
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Could not find that user' });
      }
      if (user.isPrivate && (!isSuperAdmin(req) && !isOwner(req))) {
        return res.status(403).json({
          message: "You don't have access to this resource"
        });
      }
      return res.status(200).json(user);
    })
    .catch(() => res.status(400).json({
      message: 'Invalid resource identifier'
    }));
  },

  /**
   * Method that updates a specific user
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  update(req, res) {
    if (req.body.roleId) {
      return res.status(403).json({
        message: "You're not permitted to specify your own role."
      });
    }
    req.retrievedRecord.update(req.body)
    .then((user) => {
      if (req.body.password) {
        // TODO: Implement old token blacklisting/invalidation
        res.set('x-access-token', signToken(user));
      }
      res.status(200).json(formatUser(user));
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that deletes a specific user
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  destroy(req, res) {
    if (req.retrievedRecord.roleId === 1) {
      return res.status(403).json({
        message: "You can't delete the superadministrator."
      });
    }
    req.retrievedRecord.destroy()
    .then(() => {
      if (req.retrievedRecord.id === req.decoded.id) {
        // TODO: Implement old token blacklisting/invalidation
        res.set('x-access-token', '');
      }
      res.sendStatus(204);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that searches for a user by name
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  search(req, res) {
    const dbQuery = isSuperAdmin(req) ? {} : {
      $or: [
        { id: req.decoded.id },
        { isPrivate: false }
      ]
    };
    dbQuery.name = { $iLike: `%${req.listOptions.query}%` };
    User.findAndCountAll({
      attributes: ['id', 'name'],
      where: dbQuery,
      limit: req.listOptions.limit,
      offset: req.listOptions.offset
    })
    .then((users) => {
      res.set(
        'x-list-metadata',
        getMetadata(
          users,
          req.listOptions.limit,
          req.listOptions.offset
        )
      );
      res.status(200).json(users.rows);
    })
    .catch(err => (dbErrorHandler(err, res)));
  }
};
