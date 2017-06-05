export default {
  /**
   * Middleware that sets query, limit and offset for lists
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @param {Function} next The next handler for the route
   * @returns {void}
   */
  setOptions(req, res, next) {
    const limit = Math.floor(Number(req.query.limit)) || 50;
    const offset = Math.floor(Number(req.query.offset)) || 0;
    let query;
    if (limit < 1 || offset < 0) {
      return res.status(400).json({
        message: 'Offset and limit can only be positive integers.'
      });
    }
    if (/\/api\/search/.test(req.route.path)) {
      query = req.query.q || req.query.query;
      if (!query || query.replace(/\s+/g, '') === '') {
        return res.status(400).json({
          message: 'Please provide a valid query string for the search'
        });
      }
    }
    req.listOptions = { limit, offset, query };
    next();
  }
};
