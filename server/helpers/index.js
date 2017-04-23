import jwt from 'jsonwebtoken';
import _ from 'underscore';
import model from '../models';

export const getModel = (route) => {
  switch (true) {
    case (/\/api\/users/.test(route)):
      return model.User;
    case (/\/api\/roles/.test(route)):
      return model.Role;
    case (/\/api\/documents/.test(route)):
      return model.Document;
    default:
      return null;
  }
};

export const formatUser = user => (
  _.pick(user,
    'id', 'name', 'email', 'roleId', 'organisationId', 'departmentId')
);

/**
 * Hashes and signs provided data
 * @param {*} user The user to be authenticated
 * @returns {String} The generated JSON web token
 */
export const signToken = (user) => {
  const date = new Date();
  while ((new Date()) - date <= 1000) { /* Wait */ }
  return jwt.sign(
    _.pick(user, 'id', 'roleId', 'organisationId', 'departmentId'),
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

export const dbErrorHandler = (err, res) => {
  if (
    (new RegExp([
      '(notNull Violation)|',
      '(invalid input syntax)|',
      '(invalid input value)',
      '(Validation notEmpty failed)|',
      '(Validation isEmail failed)|',
      '(Validation isDomain failed)|',
      '(Validation isUniqueWithinOrg failed)|'
    ].join(''))).test(err.message) ||
    /SequelizeForeignKeyConstraintError/.test(err.name)
  ) {
    return res.status(400).json({
      message: 'Please confirm that all fields/identifiers are valid',
      error: err
    });
  }
  if (/(readOnly)|(noUpdate)/.test(err.message)) {
    return res.status(403).json({
      message: "You're not permitted to change that ID field"
    });
  }
  return res.status(500).json({
    message: 'Oops! Something went wrong on our end',
    error: err
  });
};

export const isSuperAdmin = req => (req.decoded.roleId === 1);

export const isOwner = (req, record) =>
  (req.decoded.id === record.userId || req.decoded.id === record.id);

export const hasDocAccess = (req, document) =>
  (document.access === 'public' ||
    (document.access === 'role' && req.decoded.roleId <= document.userRole));
