import jwt from 'jsonwebtoken';
import _ from 'underscore';

export const formatUser = user => (
  _.pick(user,
    'id', 'name', 'email', 'roleId', 'organisationId', 'departmentId')
);

/**
 * Hashes and signs provided data
 * @param {*} data
 * @returns {String} The generated JSON web token
 */
export const signToken = data => (
  jwt.sign(
    data,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  )
);

export const dbErrorHandler = (err, res) => {
  if (
    (new RegExp([
      '(notNull Violation)|',
      '(invalid input syntax)|',
      '(invalid input value)',
      '(Validation notEmpty failed)|',
      '(Validation isEmail failed)|',
      '(Validation isDomain failed)|',
      '(Validation isUniqueWithinOrg failed)'
    ].join(''))).test(err.message) ||
    /SequelizeForeignKeyConstraintError/.test(err.name)
  ) {
    return res.status(400).json({
      message: 'Please confirm that all fields are valid',
      error: err
    });
  }
  return res.status(500).json({
    message: 'Oops! Something went wrong on our end',
    error: err
  });
};
