import request from 'supertest';
import server from '../../server';
import { getValidUser, getValidDoc } from '../helpers/data-helper';

describe('Documents API', () => {
  const app = request(server);
  let docOwner;
  let docOwnerToken;
  let testDocument;

  beforeAll((done) => {
    app
      .post('/api/users')
      .send(getValidUser())
      .end((err, res) => {
        if (err) throw err;
        docOwner = res.body;
        docOwnerToken = res.headers['x-access-token'];
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
        if (
        res.body.userId !== docOwner.id ||
        res.body.userName !== docOwner.name ||
        res.body.userRole !== docOwner.roleId) {
          throw new Error('Document not assigned to the right owner');
        }
        testDocument = res.body;
        done();
      });
  });

  it('should retrieve a document if the requester has access to it', (done) => {
    app
      .get(`/api/documents/${testDocument.id}`)
      .set('x-access-token', docOwnerToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected document to be retrieved');
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

  it('should update a document if the requester has proper access', (done) => {
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

  it('should delete a document on authenticated request',
  (done) => {
    app
      .delete(`/api/documents/${testDocument.id}`)
      .set('x-access-token', docOwnerToken)
      .expect(204)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
