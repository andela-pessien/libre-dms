import { isSuperAdmin, isOwner, dbErrorHandler, getMetadata } from '../helpers';
import model from '../models';

const { Document, User } = model;

export default {
  /**
   * Method that creates a new document
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  create(req, res) {
    Document.create({
      title: req.body.title,
      content: req.body.content,
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
    const dbQuery = isSuperAdmin(req) ? {} : {
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
      attributes: [
        'id',
        'title',
        'type',
        'access',
        'userId',
        'createdAt',
        'updatedAt'
      ],
      where: dbQuery,
      include: [{
        model: User,
        attributes: ['id', 'name', 'roleId']
      }],
      order: [['updatedAt', 'DESC']],
      limit: req.listOptions.limit,
      offset: req.listOptions.offset
    })
    .then((documents) => {
      res.set(
        'x-list-metadata',
        getMetadata(
          documents,
          req.listOptions.limit,
          req.listOptions.offset
        )
      );
      res.status(200).json(documents.rows);
    })
    .catch(err => (dbErrorHandler(err, res)));
  },

  /**
   * Method that retrieves a specific user's documents
   * It only sends the documents the requester has access to
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  listByUser(req, res) {
    const dbQuery = { userId: req.params.id };
    if (!isSuperAdmin(req) && !isOwner(req)) {
      dbQuery.$or = [
        { access: 'public' },
        {
          userRole: {
            $gte: req.decoded.roleId
          },
          access: 'role'
        }
      ];
    }
    Document.findAndCountAll({
      attributes: [
        'id',
        'title',
        'type',
        'access',
        'createdAt',
        'updatedAt'
      ],
      where: dbQuery,
      order: [['updatedAt', 'DESC']],
      limit: req.listOptions.limit,
      offset: req.listOptions.offset
    })
    .then((documents) => {
      res.set(
        'x-list-metadata',
        getMetadata(
          documents,
          req.listOptions.limit,
          req.listOptions.offset
        )
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
    if (!isOwner(req)) {
      if (req.body.access || req.body.accesslevel) {
        return res.status(403).json({
          message: "You're not permitted to change the share settings of this document"
        });
      }
    }
    req.retrievedRecord.update(req.body)
    .then(document => res.status(200).json(document))
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
    const dbQuery = isSuperAdmin(req) ? {} : {
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
    dbQuery.title = { $iLike: `%${req.listOptions.query}%` };
    Document.findAndCountAll({
      attributes: [
        'id',
        'title',
        'type',
        'access',
        'userId',
        'createdAt',
        'updatedAt'
      ],
      where: dbQuery,
      include: [{
        model: User,
        attributes: ['id', 'name', 'roleId']
      }],
      order: [['updatedAt', 'DESC']],
      limit: req.listOptions.limit,
      offset: req.listOptions.offset
    })
    .then((documents) => {
      res.set(
        'x-list-metadata',
        getMetadata(
          documents,
          req.listOptions.limit,
          req.listOptions.offset
        )
      );
      res.status(200).json(documents.rows);
    })
    .catch(err => (dbErrorHandler(err, res)));
  }
};
