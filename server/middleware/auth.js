import jwt from 'jsonwebtoken';
import {
  isSuperAdmin,
  isAdminOrHigher,
  isOwner,
  hasRetrieveAccess,
  hasEditAccess
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
            res.setHeader('x-access-token', '');
            return res.status(401).json({
              message: 'Access token is invalid'
            });
          }
          req.decoded = decoded;
          return next();
        }
      );
    }
    return res.status(401).json({
      message: 'You need to be logged in to perform that action'
    });
  },

  superAdminAccess(req, res, next) {
    if (isSuperAdmin(req)) {
      return next();
    }
    return res.status(403).json({
      message: 'Only the superadministrator can perform that action'
    });
  },

  adminAccess(req, res, next) {
    if (isAdminOrHigher(req)) {
      return next();
    }
    return res.status(403).json({
      message: 'Only an administrator or higher can perform that action'
    });
  },

  /**
   * Middleware that checks if the requester is the owner.
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  ownerAccess(req, res, next) {
    if (!isOwner(req)) {
      res.status(403).json({
        message: "Only this resource's owner can perform that action"
      });
    } else {
      next();
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
    let shouldProceed;
    switch (req.method) {
      case 'DELETE':
        shouldProceed = isSuperAdmin(req) || isOwner(req);
        break;
      case 'PUT':
        shouldProceed = isOwner(req) || hasEditAccess(req);
        break;
      default:
        shouldProceed = isSuperAdmin(req) || isOwner(req) ||
          hasRetrieveAccess(req);
    }
    if (shouldProceed) {
      next();
    } else {
      return res.status(403).json({
        message: "You don't have permission to perform that action"
      });
    }
  }
};
