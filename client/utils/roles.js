/**
 * Function that checks whether a user is the superadministrator
 * @param {Object} user The user to be checked
 * @returns {Boolean} True if the user is the superadministrator
 */
export function isSuperAdmin(user) {
  return (user && user.roleId === 1);
}

/**
 * Function that checks whether a user is an administrator
 * @param {Object} user The user to be checked
 * @returns {Boolean} True if the user is an administrator
 */
export function isAdmin(user) {
  return (user && user.roleId === 2);
}

/**
 * Function that checks whether a user is an administrator or higher
 * @param {Object} user The user to be checked
 * @returns {Boolean} True if the user is an administrator or higher
 */
export function isAdminOrHigher(user) {
  return (user && user.roleId <= 2);
}

/**
 * Labels for user roles
 */
export const roles = [
  'Superadministrator',
  'Administrator',
  'Reviewer',
  'Regular user'
];

/**
 * Function that gets the name of a user's role
 * @param {Number} roleId The role id of the user
 * @returns {String} The name of the role
 */
export function getRole(roleId) {
  return roles[roleId - 1];
}
