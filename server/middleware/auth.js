import jwt from 'jsonwebtoken';
import {
  isSuperAdmin,
  isOwner,
  hasDocAccess,
  getModel,
  dbErrorHandler
} from '../helpers';

export default {
  /**
   * Middleware that checks and verifies the requester's access token.
   * It also refreshes the access token if it is nearing expiry.
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  checkToken(req, res, next) {
    if (req.headers['x-access-token']) {
      return jwt.verify(
        req.headers['x-access-token'],
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            return res.status(401).json({
              message: 'Access token is invalid'
            });
          }
          req.decoded = decoded;
          next();
        }
      );
    } else if (req.route.path === '/api/users' && req.route.methods.post) {
      next();
    } else {
      return res.status(401).json({
        message: 'You need to be logged in to perform that action'
      });
    }
  },

  /**
   * Middleware that checks if the requester has access to the resource.
   * This means they are either the owner or a (super)admin.
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  hasAccess(req, res, next) {
    const Model = getModel(req.route.path);
    Model.findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (record) {
        let shouldProceed;
        if (req.route.methods.delete) {
          shouldProceed = isSuperAdmin(req) || isOwner(req, record);
        } else {
          shouldProceed = isSuperAdmin(req) || isOwner(req, record) ||
            hasDocAccess(req, record);
        }
        if (shouldProceed) {
          req.retrievedRecord = record;
          next();
        } else {
          return res.status(403).json({
            message: "You don't have access to this resource"
          });
        }
      } else {
        return res.status(404).json({
          message: 'Resource not found'
        });
      }
    })
    .catch(err => (dbErrorHandler(err, res)));
  }
};
