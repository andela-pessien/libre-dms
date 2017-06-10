/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import server from '../../server';
import { getValidId, getValidUser, getValidDoc, getWord } from '../helpers/data-helper';
import { checkDocumentList } from '../helpers/response-helper';

describe('Documents API', () => {
  const app = request(server);
  let docOwner, docOwnerToken, superAdminToken, adminToken, regularUser,
    regularUserToken, reviewer, reviewerToken, testDocument;

  beforeAll((done) => {
    app
      .post('/api/users')
      .send(getValidUser())
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        docOwner = res.body;
        docOwnerToken = res.headers['x-access-token'];
        app
          .post('/api/users')
          .send(getValidUser())
          .expect(201)
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
              .expect(200)
              .end((err, res) => {
                if (err) throw err;
                superAdminToken = res.headers['x-access-token'];
                const adminDetails = getValidUser();
                app
                  .post('/api/users')
                  .send(adminDetails)
                  .expect(201)
                  .end((err, res) => {
                    if (err) throw err;
                    app
                      .put(`/api/users/${res.body.id}/set-role`)
                      .set('x-access-token', superAdminToken)
                      .send({
                        roleId: 2
                      })
                      .expect(200)
                      .end((err, res) => {
                        if (err) throw err;
                        app
                          .post('/api/auth/login')
                          .send({
                            email: adminDetails.email,
                            password: adminDetails.password
                          })
                          .expect(200)
                          .end((err, res) => {
                            if (err) throw err;
                            adminToken = res.headers['x-access-token'];
                            const reviewerDetails = getValidUser();
                            app
                              .post('/api/users')
                              .send(reviewerDetails)
                              .expect(201)
                              .end((err, res) => {
                                if (err) throw err;
                                reviewer = res.body;
                                app
                                  .put(`/api/users/${reviewer.id}/set-role`)
                                  .set('x-access-token', superAdminToken)
                                  .send({
                                    roleId: 3
                                  })
                                  .expect(200)
                                  .end((err) => {
                                    if (err) throw err;
                                    app
                                      .post('/api/auth/login')
                                      .send({
                                        email: reviewerDetails.email,
                                        password: reviewerDetails.password
                                      })
                                      .expect(200)
                                      .end((err, res) => {
                                        if (err) throw err;
                                        reviewerToken = res.headers['x-access-token'];
                                        done();
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  describe('POST /api/documents', () => {
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

  describe('GET /api/documents', () => {
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

    it('should return any and all documents on superadministrator request', (done) => {
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

    it('should return any and all documents on administrator request', (done) => {
      app
        .get('/api/documents')
        .set('x-access-token', adminToken)
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

    it("should retrieve all of a user's documents on superadministrator request", (done) => {
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

    it("should retrieve all of a user's documents on administrator request", (done) => {
      app
        .get(`/api/users/${docOwner.id}/documents`)
        .set('x-access-token', adminToken)
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

  describe('GET /api/search/documents', () => {
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

    it('should return any and all matching documents on administrator request', (done) => {
      const query = getWord(testDocument.title);
      app
        .get(`/api/search/documents?q=${query}&limit=100`)
        .set('x-access-token', adminToken)
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

  describe('GET /api/documents/:id', () => {
    let roleDocument;
    let reviewerRoleDocument;

    beforeAll((done) => {
      app.post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send(getValidDoc(undefined, 'role'))
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          roleDocument = res.body;
          app.post('/api/documents')
            .set('x-access-token', reviewerToken)
            .send(getValidDoc(undefined, 'role'))
            .expect(201)
            .end((err, res) => {
              if (err) throw err;
              reviewerRoleDocument = res.body;
              done();
            });
        });
    });

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

    it("should return the document on administrator's request", (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .set('x-access-token', adminToken)
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

    it('should return an error if regular user tries to access a private document that is not theirs', (done) => {
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

    it('should return an error if reviewer tries to access a private document that is not theirs', (done) => {
      app
        .get(`/api/documents/${testDocument.id}`)
        .set('x-access-token', reviewerToken)
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

    it('should return an error if user tries to access a role-access document above their role', (done) => {
      app
        .get(`/api/documents/${reviewerRoleDocument.id}`)
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

    it('should return a role-access document if requester has the same or higher role', (done) => {
      app
        .get(`/api/documents/${roleDocument.id}`)
        .set('x-access-token', reviewerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected document to be returned');
          }
          if (
            res.body.id !== roleDocument.id ||
            res.body.title !== roleDocument.title ||
            res.body.content !== roleDocument.content ||
            res.body.userId !== roleDocument.userId
          ) {
            throw new Error('Did not retrieve the right document');
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

  describe('PUT /api/documents/:id', () => {
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

    it('should return error if requester is not the owner', (done) => {
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
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
          done();
        });
    });

    it('should return error an administrator request', (done) => {
      const updatedDocData = getValidDoc();
      app
        .put(`/api/documents/${testDocument.id}`)
        .set('x-access-token', adminToken)
        .send({
          title: updatedDocData.title,
          content: updatedDocData.content
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
          done();
        });
    });

    it('should return error even an superadministrator request', (done) => {
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
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
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

  describe('DELETE /api/documents/:id', () => {
    let secondTestDocument;

    beforeAll((done) => {
      app
        .post('/api/documents')
        .set('x-access-token', docOwnerToken)
        .send(getValidDoc())
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          secondTestDocument = res.body;
          done();
        });
    });

    it('should return error if request is not authenticated', (done) => {
      app
        .delete(`/api/documents/${testDocument.id}`)
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

    it('should return error if requester is not the owner', (done) => {
      app
        .delete(`/api/documents/${testDocument.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You don't have permission to perform that action");
          done();
        });
    });

    it('should return error if requester is an administrator', (done) => {
      app
        .delete(`/api/documents/${testDocument.id}`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You don't have permission to perform that action");
          done();
        });
    });

    it('should delete a document on superadmin request', (done) => {
      app
        .delete(`/api/documents/${testDocument.id}`)
        .set('x-access-token', superAdminToken)
        .expect(204)
        .end((err) => {
          if (err) throw err;
          app
            .get(`/api/documents/${testDocument.id}`)
            .set('x-access-token', docOwnerToken)
            .expect(404, done());
        });
    });

    it('should delete a document on owner request', (done) => {
      app
        .delete(`/api/documents/${secondTestDocument.id}`)
        .set('x-access-token', docOwnerToken)
        .expect(204)
        .end((err) => {
          if (err) throw err;
          app
            .get(`/api/documents/${secondTestDocument.id}`)
            .set('x-access-token', docOwnerToken)
            .expect(404, done());
        });
    });
  });
});
