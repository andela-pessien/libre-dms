import { getModel } from '../helpers';

export default {
  /**
   * Middleware that retrieves a record from the database
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  retrieveRecord(req, res, next) {
    const Model = getModel(req.url);
    Model.findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (record) {
        req.retrievedRecord = record;
        next();
      } else {
        return res.status(404).json({
          message: 'Resource not found'
        });
      }
    })
    .catch(() => res.status(400).json({
      message: 'Invalid resource identifier'
    }));
  },

  /**
   * Middleware that checks if requester is trying to change an ID field
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  noIDChange(req, res, next) {
    if (req.body.id) {
      return res.status(403).json({
        message: "You're not permitted to change identifier fields"
      });
    }
    next();
  }
};
