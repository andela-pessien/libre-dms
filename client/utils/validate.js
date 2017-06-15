/* eslint-disable max-len */
/**
 * Function that checks if a string is a valid email according to RFC 5322 Official Standard
 * @param {String} string The string to be tested
 * @returns {Boolean} True if the string is a valid email
 */
export const isValidEmail = string =>
  (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string));

/**
 * Function that checks if a string is a valid first and last name combination
 * Only letters, apostrophes and hyphens are permitted
 * @param {String} string The string to be tested
 * @returns {Boolean} True if the string is a valid name
 */
export const isValidName = string => (/^([A-z][A-Za-z-']*\s+[A-z][A-Za-z-']*)$/.test(string));
