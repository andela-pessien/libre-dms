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
};
