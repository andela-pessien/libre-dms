import jwt from 'jsonwebtoken';
import _ from 'underscore';
import model from '../models';

export const getModel = (route) => {
  switch (true) {
    case (/\/api\/users/.test(route)):
      return model.User;
    case (/\/api\/documents/.test(route)):
      return model.Document;
    default:
      return model.Role;
  }
};

export const formatUser = user => (
  _.pick(
    user,
    'id',
    'name',
    'email',
    'isPrivate',
    'roleId',
    'createdAt'
  )
);

export const formatDoc = document => (
  _.pick(
    document,
    'id',
    'title',
    'content',
    'access',
    'accesslevel',
    'type',
    'userId',
    'userRole',
    'createdAt',
    'updatedAt'
  )
);

export const formatRole = role => (
  _.pick(role, 'id', 'label')
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
    _.pick(user, 'id', 'roleId'),
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

export const dbErrorHandler = (err, res) => {
  switch (true) {
    case (/notNull Violation/.test(err.message)):
      return res.status(400).json({
        message: err.message.replace('notNull Violation: ', '')
      });
    case (/Please provide/.test(err.message)):
    case (/Passwords must be at least 8 characters/.test(err.message)):
    case (/Passwords cannot be just whitespace/.test(err.message)):
    case (/can only be/.test(err.message)):
      return res.status(400).json({
        message: err.message.replace(/(Validation error: )|(,(\n|\\n)[\s\S]*$)/g, '')
      });
    case (/operator does not exist/.test(err.message)):
      return res.status(400).json({
        message: 'Please confirm that all fields are valid'
      });
    case (/Someone has already signed up with that email/.test(err.message)):
      return res.status(403).json({
        message: err.message
      });
    case (/noUpdate/.test(err.message)):
      return res.status(403).json({
        message: "You're not permitted to change identifier fields"
      });
    default:
      return res.status(500).json({
        message: 'Oops! Something went wrong on our end'
      });
  }
};

export const isSuperAdmin = req => (req.decoded.roleId === 1);

export const isAdminOrHigher = req => (req.decoded.roleId <= 2);

export const isOwner = req => (
  req.decoded.id === req.params.id ||
  (req.retrievedRecord &&
    (req.decoded.id === req.retrievedRecord.userId ||
    req.decoded.id === req.retrievedRecord.id))
);

export const hasRetrieveAccess = req => (
  req.retrievedRecord.access === 'public' ||
  (req.retrievedRecord.access === 'role' &&
    req.decoded.roleId <= req.retrievedRecord.userRole)
);

export const getMetadata = (results, limit, offset) => ({
  total: results.count,
  pages: Math.ceil(results.count / limit),
  currentPage: (Math.floor(offset / limit) + 1),
  pageSize: limit
});

export const isQuillDocument = (content) => {
  let delta;
  try {
    delta = JSON.parse(content);
  } catch (err) {
    return false;
  }
  if (!delta.ops || !Array.isArray(delta.ops) || delta.ops.length === 0) {
    return false;
  }
  let flag = true;
  delta.ops.forEach((operation) => {
    if (!operation.insert || typeof operation.insert !== 'string') {
      flag = false;
    }
  });
  return flag;
};
