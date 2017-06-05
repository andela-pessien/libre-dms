/**
 * Parses an encoded metadata header
 * @param {String} encodedMetadata The base64 encoded metadata
 * @returns {Object} The parsed metadata
 */
export default function decodeMetadata(encodedMetadata) {
  let metadata;
  try {
    return JSON.parse(
      Buffer.from(encodedMetadata, 'base64').toString('utf-8'));
  } catch (err) {
    return metadata;
  }
}
