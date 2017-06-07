/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import server from '../../server';
import { getValidId, getValidUser, getValidDoc, getWord } from '../helpers/data-helper';
import { checkDocumentList } from '../helpers/response-helper';

describe('Documents API', () => {
  const app = request(server);
  let docOwner, docOwnerToken, superAdminToken, regularUser, regularUserToken, testDocument, editableDocument;

  beforeAll((done) => {
    app
      .post('/api/users')
      .send(getValidUser())
      .end((err, res) => {
        if (err) throw err;
        docOwner = res.body;
        docOwnerToken = res.headers['x-access-token'];
        app
          .post('/api/users')
          .send(getValidUser())
          .end((err, res) => {
            if (err) throw err;
            regularUser = res.body;
            regularUserToken = res.headers['x-access-token'];
            app
              .post('/api/auth/login')
              .send({
                email: process.env.SADMIN_EMAIL,
                password: process.env.SADMIN_PASSWORD
              })
              .end((err, res) => {
                if (err) throw err;
                superAdminToken = res.headers['x-access-token'];
                done();
              });
          });
      });
  });

  describe('Creating a document', () => {
    it('should return error if request is not authenticated', (done) => {
      app.post('/api/documents')
        .send(getValidDoc())
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it('should return error if new document has no title', (done) => {
      const document = getValidDoc();
      app.post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send({
          content: document.content
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please confirm that all fields are valid') {
            throw new Error(
              `Expected ${res.body.message} to equal 'Please confirm that all fields are valid'`
            );
          }
          done();
        });
    });

    it('should return error if new document has invalid access', (done) => {
      const document = getValidDoc();
      app.post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send({
          ...document,
          access: 'wrongaccess'
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please confirm that all fields are valid') {
            throw new Error(
              `Expected ${res.body.message} to equal 'Please confirm that all fields are valid'`
            );
          }
          done();
        });
    });

    it('should return error if new document has invalid access level', (done) => {
      const document = getValidDoc();
      app.post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send({
          ...document,
          accesslevel: 'wrongaccesslevel'
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please confirm that all fields are valid') {
            throw new Error(
              `Expected ${res.body.message} to equal 'Please confirm that all fields are valid'`
            );
          }
          done();
        });
    });

    it('should create a new document on authenticated request', (done) => {
      app
        .post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send(getValidDoc())
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected created document to be returned');
          }
          if (
          !res.body.id ||
          (!res.body.title && res.body.title !== '') ||
          !res.body.content ||
          !res.body.type ||
          !res.body.access ||
          !res.body.accesslevel) {
            throw new Error('Document not created properly');
          }
          if (res.body.userId !== docOwner.id) {
            throw new Error('Document not assigned to the right owner');
          }
          testDocument = res.body;
          done();
        });
    });
  });

  describe('Listing documents', () => {
    beforeAll((done) => {
      app
        .post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send(getValidDoc())
        .expect(201)
        .end((err) => {
          if (err) throw err;
          app
            .post('/api/documents')
            .set('x-access-token', docOwnerToken)
            .send({
              ...getValidDoc(),
              access: 'public'
            })
            .expect(201)
            .end((err) => {
              if (err) throw err;
              done();
            });
        });
    });

    it('should return error if request is not authenticated', (done) => {
      app.get('/api/documents')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it('should return error if limit or offset provided are negative', (done) => {
      app
        .get('/api/documents?limit=-10&offset=-50')
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.body.message).toEqual('Offset and limit can only be positive integers.');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });

    it('should return any and all documents on superadmin request', (done) => {
      app
        .get('/api/documents')
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkDocumentList(res);
          done();
        });
    });

    it('should return only documents the requester has access to', (done) => {
      app
        .get('/api/documents?limit=100')
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkDocumentList(res);
          res.body.forEach((document) => {
            if (
            (document.access === 'private' && document.userId !== docOwner.id) ||
            (document.access === 'role' && document.userRole < 6)) {
              throw new Error('Retrieved a document this user does not have access to');
            }
          });
          done();
        });
    });

    it("should retrieve all of a user's documents on superadmin request", (done) => {
      app
        .get(`/api/users/${docOwner.id}/documents`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkDocumentList(res);
          if (res.body.length !== 3) {
            throw new Error('Did not retrieve all documents');
          }
          done();
        });
    });

    it("should retrieve all of a user's own documents on request", (done) => {
      app
        .get(`/api/users/${docOwner.id}/documents`)
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkDocumentList(res);
          if (res.body.length !== 3) {
            throw new Error('Did not retrieve all documents');
          }
          done();
        });
    });

    it("should retrieve only those of a user's documents the requester has access to", (done) => {
      app
        .get(`/api/users/${docOwner.id}/documents`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkDocumentList(res);
          if (res.body[0].access !== 'public' || res.body.length !== 1) {
            throw new Error('Retrieved a document this user does not have access to');
          }
          done();
        });
    });
  });

  describe('Searching for documents by title', () => {
    it('should return error if request is not authenticated', (done) => {
      const query = getWord(testDocument.title);
      app
        .get(`/api/search/documents?q=${query}&limit=100`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it('should return error if no search terms are provided', (done) => {
      app
        .get('/api/search/documents')
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.body).toExist();
            expect(res.body.message).toEqual('Please provide a valid query string for the search');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });

    it('should return any and all matching documents on superadministrator request', (done) => {
      const query = getWord(testDocument.title);
      app
        .get(`/api/search/documents?q=${query}&limit=100`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkDocumentList(res);
          let found = false;
          res.body.forEach((result) => {
            if (result.title === testDocument.title) {
              found = true;
            }
          });
          if (!found) {
            throw new Error('Did not find the test document');
          }
          done();
        });
    });

    it('should return own documents regardless of access', (done) => {
      const query = getWord(testDocument.title);
      app
        .get(`/api/search/documents?query=${query}&limit=100`)
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkDocumentList(res);
          let found = false;
          res.body.forEach((result) => {
            if (result.title === testDocument.title) {
              found = true;
            }
            if (
            (result.access === 'private' && result.userId !== docOwner.id) ||
            (result.access === 'role' && result.userRole < docOwner.roleId)) {
              throw new Error('Returned a document this user does not have access to');
            }
          });
          if (!found) {
            throw new Error('Did not find the test document');
          }
          done();
        });
    });

    it('should return only documents the requester has access to', (done) => {
      const query = getWord(testDocument.title);
      app
        .get(`/api/search/documents?q=${query}&limit=100`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.forEach((result) => {
            if (
            result.access === 'private' ||
            (result.access === 'role' && result.userRole < regularUser.roleId)) {
              throw new Error('Returned a document this user does not have access to');
            }
          });
          done();
        });
    });
  });

  describe('Retrieving a document', () => {
    it('should return error if request is not authenticated', (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it("should return the document on owner's request", (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected document to be returned');
          }
          if (
            res.body.id !== testDocument.id ||
            res.body.title !== testDocument.title ||
            res.body.content !== testDocument.content ||
            res.body.userId !== testDocument.userId
          ) {
            throw new Error('Did not retrieve the right document');
          }
          done();
        });
    });

    it("should return the document on superadministrator's request", (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected document to be returned');
          }
          if (
            res.body.id !== testDocument.id ||
            res.body.title !== testDocument.title ||
            res.body.content !== testDocument.content ||
            res.body.userId !== testDocument.userId
          ) {
            throw new Error('Did not retrieve the right document');
          }
          done();
        });
    });

    it('should return an error if requester does not have access', (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You don't have permission to perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "You don't have permission to perform that action"`);
          }
          done();
        });
    });

    it('should return an error if document does not exist', (done) => {
      app
        .get(`/api/documents/${getValidId()}`)
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Resource not found') {
            throw new Error(`Expected ${res.body.message} to equal 'Resource not found'"`);
          }
          done();
        });
    });
  });

  describe('Updating a document', () => {
    beforeAll((done) => {
      app.post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send(getValidDoc(undefined, 'public', 'edit'))
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          editableDocument = res.body;
          done();
        });
    });

    it('should return error if request is not authenticated', (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${testDocument.id}`)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it("should return updated document on owner's request", (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${testDocument.id}`)
        .set('x-access-token', docOwnerToken)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected updated document to be returned');
          }
          if (
            res.body.title !== updatedDocData.title ||
            res.body.content !== updatedDocData.content
          ) {
            throw new Error('Document not updated properly');
          }
          testDocument = res.body;
          done();
        });
    });

    it('should return an error if requester does not have retrieve access', (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${testDocument.id}`)
        .set('x-access-token', regularUserToken)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You don't have permission to perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "You don't have permission to perform that action"`);
          }
          done();
        });
    });

    it('should return an error if requester has retrieve but not edit access', (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${testDocument.id}`)
        .set('x-access-token', superAdminToken)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You don't have permission to perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "You don't have permission to perform that action"`);
          }
          done();
        });
    });

    it('should return updated document if requester has edit access', (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${editableDocument.id}`)
        .set('x-access-token', regularUserToken)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected updated document to be returned');
          }
          if (
            res.body.title !== updatedDocData.title ||
            res.body.content !== updatedDocData.content
          ) {
            throw new Error('Document not updated properly');
          }
          editableDocument = res.body;
          done();
        });
    });

    it('should return an error if non-owner tries to change share settings', (done) => {
      app
        .put(`/api/documents/${editableDocument.id}`)
        .set('x-access-token', superAdminToken)
        .send({
          access: 'role',
          accesslevel: 'view'
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You can't change the share settings of this document") {
            throw new Error(`Expected ${res.body.message} to equal "You can't change the share settings of this document"`);
          }
          done();
        });
    });

    it("should fail if user tries to change the document's ID", (done) => {
      app
        .put(`/api/documents/${testDocument.id}`)
        .send({ id: getValidId() })
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.body.message).toEqual("You're not permitted to change identifier fields");
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });

    it("should fail if user tries to change the document's owner", (done) => {
      app
        .put(`/api/documents/${testDocument.id}`)
        .send({ userId: getValidId() })
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.body.message).toEqual("You're not permitted to change identifier fields");
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });

    it('should return an error if document does not exist', (done) => {
      app
        .put(`/api/documents/${getValidId()}`)
        .set('x-access-token', docOwnerToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Resource not found') {
            throw new Error(`Expected ${res.body.message} to equal 'Resource not found'"`);
          }
          done();
        });
    });
  });

  describe('Deleting a document', () => {
    it('should return error if request is not authenticated', (done) => {
      app
        .delete(`/api/documents/${editableDocument.id}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'You need to be logged in to perform that action') {
            throw new Error(`Expected ${res.body.message} to equal 'You need to be logged in to perform that action'`);
          }
          done();
        });
    });

    it('should return error if requester is not owner or superadmin regardless of access/access level', (done) => {
      app
        .delete(`/api/documents/${editableDocument.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You don't have permission to perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "You don't have permission to perform that action"`);
          }
          done();
        });
    });

    it('should delete a document on superadmin request', (done) => {
      app
        .delete(`/api/documents/${editableDocument.id}`)
        .set('x-access-token', superAdminToken)
        .expect(204)
        .end((err) => {
          if (err) throw err;
          app
            .get(`/api/documents/${editableDocument.id}`)
            .set('x-access-token', docOwnerToken)
            .expect(404, done());
        });
    });

    it('should delete a document on owner request', (done) => {
      app
        .delete(`/api/documents/${testDocument.id}`)
        .set('x-access-token', docOwnerToken)
        .expect(204)
        .end((err) => {
          if (err) throw err;
          app
            .get(`/api/documents/${testDocument.id}`)
            .set('x-access-token', docOwnerToken)
            .expect(404, done());
        });
    });
  });
});
