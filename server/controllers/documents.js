import { isSuperAdmin, isOwner, dbErrorHandler } from '../helpers';
import model from '../models';

const { Document } = model;

export default {
  /**
   * Method that creates a new document
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  create(req, res) {
    if (req.body.title === null || req.body.title === undefined) {
      return res.status(400).json({
        message: 'Please provide a title for the document'
      });
    }
    Document.create({
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      access: req.body.access,
      accesslevel: req.body.accesslevel,
      userId: req.decoded.id,
      organisationId: req.decoded.organisationId,
      departmentId: req.decoded.departmentId
    })
    .then(document => (res.status(201).json(document)))
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that lists all documents that the requester has access to
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  list(req, res) {
    const limit = Math.floor(Number(req.query.limit)) || 50;
    const offset = Math.floor(Number(req.query.offset)) || 0;
    if (limit < 1 || offset < 0) {
      return res.status(400).json({
        message: 'Offset and limit can only be positive integers.'
      });
    }
    const dbQuery = req.decoded.roleId === 1 ? {} : {
      $or: [
        { access: 'public' },
        {
          userRole: {
            $gte: req.decoded.roleId
          },
          access: 'role'
        },
        { userId: req.decoded.id }
      ]
    };
    Document.findAndCountAll({
      attributes: ['id', 'title', 'type', 'access', 'userId', 'userName'],
      where: dbQuery,
      limit,
      offset
    })
    .then((documents) => {
      const metadata = JSON.stringify({
        total: documents.count,
        pages: Math.ceil(documents.count / limit),
        currentPage: (Math.floor(offset / limit) + 1),
        pageSize: documents.rows.length
      });
      res.set(
        'x-list-metadata',
        Buffer.from(metadata, 'utf8').toString('base64')
      );
      res.status(200).json(documents.rows);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that retrieves a specific document by id
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  retrieve(req, res) {
    res.status(200).json(req.retrievedRecord);
  },

  /**
   * Method that updates a specific document
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  update(req, res) {
    if (!(isSuperAdmin(req) || (isOwner(req, req.retrievedRecord)))) {
      if (req.retrievedRecord.accesslevel !== 'edit') {
        return res.status(403).json({
          message: "You're not permitted to edit this document"
        });
      }
    }
    req.retrievedRecord.update(req.body)
    .then((document) => {
      if (!document) {
        return res.status(500).json({
          message: 'Oops! Something went wrong on our end'
        });
      }
      res.status(200).json(document);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that deletes a specific document
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  destroy(req, res) {
    req.retrievedRecord.destroy()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that searches for a document by title
   * It should only return documents that the requester has access to
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  search(req, res) {
    const query = req.query.title || req.query.q || req.query.query;
    if (query && query.replace(/\s+/g, '') !== '') {
      const limit = Math.floor(Number(req.query.limit)) || 10;
      const offset = Math.floor(Number(req.query.offset)) || 0;
      if (limit < 1 || offset < 0) {
        return res.status(400).json({
          message: 'Offset and limit can only be positive integers.'
        });
      }
      const dbQuery = req.decoded.roleId === 1 ? {} : {
        $or: [
          { access: 'public' },
          {
            userRole: {
              $gte: req.decoded.roleId
            },
            access: 'role'
          },
          { userId: req.decoded.id }
        ]
      };
      dbQuery.title = { $iLike: `%${query}%` };
      Document.findAndCountAll({
        attributes: ['id', 'title', 'type', 'access', 'userId', 'userName'],
        where: dbQuery,
        limit,
        offset
      })
      .then((documents) => {
        const metadata = JSON.stringify({
          total: documents.count,
          pages: Math.ceil(documents.count / limit),
          currentPage: (Math.floor(offset / limit) + 1),
          pageSize: documents.rows.length
        });
        res.set(
          'x-search-metadata',
          Buffer.from(metadata, 'utf8').toString('base64')
        );
        res.status(200).json(documents.rows);
      })
      .catch(err => (dbErrorHandler(err, res)));
    } else {
      return res.status(400).json({
        message: 'Please provide a valid query string for the search'
      });
    }
  }
};
