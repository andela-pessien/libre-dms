import jwt from 'jsonwebtoken';
import _ from 'underscore';
import model from '../models';

const getModel = (route) => {
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

export const isSuperAdmin = req => (req.decoded.roleId === 1);

export const isOwner = (req, cb) => {
  if (req.decoded.id === req.params.id) {
    cb();
  } else {
    const Model = getModel(req.route.path);
    Model.findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (record) {
        if (req.decoded.id === record.userId) {
          req.retrievedRecord = record;
          cb();
        } else {
          cb({
            message: "You don't have access to this resource"
          }, 403);
        }
      } else {
        cb({ message: 'Resource not found' }, 404);
      }
    })
    .catch((err) => {
      cb({
        message: 'Bad request',
        error: err
      }, 400);
    });
  }
};
