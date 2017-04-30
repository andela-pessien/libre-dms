import { formatUser, signToken, dbErrorHandler } from '../helpers';
import model from '../models';

const { User } = model;

export default {
  /**
   * Handler that logs in a user and sends them an access token
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  login(req, res) {
    if (req.body.email && req.body.password) {
      User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'No user with that email exists',
          });
        }
        if (!user.verifyPassword(req.body.password)) {
          return res.status(403).json({
            message: 'Failed to authenticate with provided credentials'
          });
        }
        res.set('x-access-token', signToken(user));
        return res.status(200).json(formatUser(user));
      })
      .catch(err => (dbErrorHandler(err, res)));
    } else {
      return res.status(400).json({
        message: 'Please provide an email and password'
      });
    }
  },

  /**
   * Handler that logs out a user and invalidates their access token
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  logout(req, res) {
    // TODO: Implement token invalidation/blacklisting
    res.set('x-access-token', '');
    res.status(200).json({
      message: 'Logout successful!'
    });
  },
};
