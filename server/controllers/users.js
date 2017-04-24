import {
  formatUser,
  signToken,
  dbErrorHandler,
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
      User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) {
          return res.status(403).json({
            message: 'A user with that email already exists'
          });
        }
        if (req.body.roleId === 1) {
          if (req.decoded) {
            if (req.decoded.data.roleId > 1) {
              return res.status(403).json({
                message: "You're not permitted to create a superadministrator"
              });
            }
          } else {
            return res.status(403).json({
              message: "You're not permitted to create a superadministrator"
            });
          }
        }
        if (req.body.roleId === 2) {
          if (req.decoded) {
            if (req.decoded.data.roleId > 2) {
              return res.status(403).json({
                message: "You're not permitted to create an administrator"
              });
            }
          } else {
            return res.status(403).json({
              message: "You're not permitted to create an administrator"
            });
          }
        }
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          roleId: req.body.roleId,
          organisationId: req.body.organisationId,
          departmentId: req.body.departmentId
        })
        .then((newUser) => {
          res.set('x-access-token', signToken(newUser));
          return res.status(201).json(formatUser(newUser));
        })
        .catch(err => (dbErrorHandler(err, res)));
      })
      .catch(err => (
        res.status(400).json({
          message: 'Please provide a valid email',
          error: err
        })
      ));
    } else {
      return res.status(400).json({
        message: 'Please provide a name, email and password'
      });
    }
  },

  /**
   * Method that retrieves a specific user by id
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  retrieve(req, res) {
    User.find({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      return res.status(200).send(formatUser(user));
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that updates a specific user
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  update(req, res) {
    if (req.body.password) {
      if (req.decoded.id !== req.retrievedRecord.id) {
        return res.status(403).json({
          message: 'Only the user can change their password'
        });
      }
    }
    req.retrievedRecord.update(req.body)
    .then((user) => {
      if (!user) {
        return res.status(500).json({
          message: 'Oops! Something went wrong on our end'
        });
      }
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
   * Method that retrieves a specific user's documents
   * It only sends the documents the requester has access to
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  listDocuments(req, res) {
    User.find({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (isSuperAdmin(req) || isOwner(req, user)) {
        user.getDocuments()
        .then(documents => res.status(200).json(documents))
        .catch(err => (dbErrorHandler(err, res)));
      } else {
        user.getDocuments({
          where: {
            $or: {
              access: 'public',
              userRole: {
                $lte: req.decoded.roleId
              }
            }
          }
        })
        .then(documents => res.status(200).json(documents))
        .catch(err => (dbErrorHandler(err, res)));
      }
    })
    .catch(err => (dbErrorHandler(err, res)));
  },
};
