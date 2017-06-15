import {
  formatUser,
  signToken,
  dbErrorHandler,
  getMetadata,
  isAdminOrHigher,
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
    if (req.body.roleId) {
      return res.status(403).json({
        message: "You're not permitted to specify your own role."
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
  },

  /**
   * Method that lists all users
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  list(req, res) {
    const dbQuery = isAdminOrHigher(req) ? {} : {
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
      res.status(200).json({
        list: users.rows,
        metadata: getMetadata(
          users,
          req.listOptions.limit,
          req.listOptions.offset
        )
      });
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
        'createdAt',
        'deletedAt'
      ],
      where: { id: req.params.id },
      paranoid: false
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Could not find that user' });
      }
      if (user.deletedAt) {
        return res.status(404).json({ message: 'This user has been deleted' });
      }
      if (user.isPrivate && (!isAdminOrHigher(req) && !isOwner(req))) {
        return res.status(403).json({
          message: "You don't have access to this resource"
        });
      }
      return res.status(200).json(formatUser(user));
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
    try {
      if (req.retrievedRecord.verifyPassword(req.body.password)) {
        return res.status(409).json({
          message: "Please choose a password that's different from your last one."
        });
      }
    } catch (err) { /* Do nothing */ }
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
      res.status(200).json({
        message: 'User deleted successfully'
      });
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
    const dbQuery = isAdminOrHigher(req) ? {} : {
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
      res.status(200).json({
        list: users.rows,
        metadata: getMetadata(
          users,
          req.listOptions.limit,
          req.listOptions.offset
        )
      });
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that sets a user's role
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {undefined}
   */
  setRole(req, res) {
    req.body.roleId = parseInt(req.body.roleId, 10);
    switch (true) {
      case (!(req.body.roleId >= 1 && req.body.roleId <= 4)):
        res.status(400).json({
          message: 'Please provide a valid role ID'
        });
        break;
      case (req.body.roleId === 1):
        res.status(403).json({
          message: 'There can only be one superadministrator'
        });
        break;
      case (req.retrievedRecord.roleId === 1):
        res.status(403).json({
          message: "The superadministrator's role cannot be changed"
        });
        break;
      case (req.retrievedRecord.id === req.decoded.id):
        res.status(403).json({
          message: "You're not permitted to set your own role"
        });
        break;
      case (req.retrievedRecord.roleId === req.body.roleId):
        res.status(409).json({
          message: `${req.retrievedRecord.name} already occupies that role`
        });
        break;
      case (
      req.retrievedRecord.roleId === 2 &&
      req.decoded.roleId !== 1):
        res.status(403).json({
          message: 'Only the superadministrator can demote administrators'
        });
        break;
      default:
        req.retrievedRecord.update({ roleId: req.body.roleId })
        .then(user => (res.status(200).json(formatUser(user))))
        .catch(() => res.status(500).json({
          message: 'An error occurred while demoting this user'
        }));
    }
  }
};
