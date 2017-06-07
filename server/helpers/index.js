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
  _.pick(
    user,
    'id',
    'name',
    'email',
    'isPrivate',
    'roleId',
    'organisationId',
    'departmentId',
    'createdAt'
  )
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
  switch (true) {
    case (/notNull Violation/.test(err.message)):
    case (/invalid input syntax/.test(err.message)):
    case (/invalid input value/.test(err.message)):
    case (/Validation notEmpty failed/.test(err.message)):
    case (/Validation isEmail failed/.test(err.message)):
    case (/Validation isDomain failed/.test(err.message)):
    case (/Validation isUniqueWithinOrg failed/.test(err.message)):
    case (/operator does not exist/.test(err.message)):
      return res.status(400).json({
        message: 'Please confirm that all fields are valid',
        error: err
      });
    case (/noUpdate/.test(err.message)):
      return res.status(403).json({
        message: "You're not permitted to change identifier fields"
      });
    default:
      return res.status(500).json({
        message: 'Oops! Something went wrong on our end',
        error: err
      });
  }
};

export const isSuperAdmin = req => (req.decoded.roleId === 1);

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

export const hasEditAccess = req => (
  hasRetrieveAccess(req) &&
  req.retrievedRecord.accesslevel === 'edit'
);

export const getMetadata = (results, limit, offset) => {
  const metadata = JSON.stringify({
    total: results.count,
    pages: Math.ceil(results.count / limit),
    currentPage: (Math.floor(offset / limit) + 1),
    pageSize: limit
  });
  return Buffer.from(metadata, 'utf8').toString('base64');
};

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
