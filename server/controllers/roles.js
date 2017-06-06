import { dbErrorHandler } from '../helpers';
import model from '../models';

const { Role } = model;

export default {
  /**
   * Method that lists all roles
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  list(req, res) {
    Role.findAll({})
    .then(roles => res.status(200).json(roles))
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that retrieves a particular role by ID
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  retrieve(req, res) {
    res.status(200).json(req.retrievedRecord);
  }
};
