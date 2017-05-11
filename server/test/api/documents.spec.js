import request from 'supertest';
import server from '../../server';
import { getValidUser, getValidDoc, getWord } from '../helpers/data-helper';

describe('Documents Controller', () => {
  const app = request(server);
  let docOwner, docOwnerToken, testDocument;

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
        if (res.body.userId !== docOwner.id) {
          throw new Error('Document not assigned to the right owner');
        }
        testDocument = res.body;
        done();
      });
  });

  it('should return all documents the requester has access to', (done) => {
    app
      .get('/api/documents')
      .set('x-access-token', docOwnerToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!Array.isArray(res.body)) {
          throw new Error('Expected response body to be an array');
        }
        const document = res.body[Math.floor(Math.random() * res.body.length)];
        if (
        !document.id ||
        !document.title ||
        document.content ||
        !document.type ||
        !document.access ||
        document.accesslevel ||
        !document.userId) {
          throw new Error('Response is not an array of formatted documents');
        }
        if (!res.headers['x-list-metadata']) {
          throw new Error('Expected to receive list metadata');
        }
        const metadata = JSON.parse(
          Buffer
          .from(res.headers['x-list-metadata'], 'base64')
          .toString('utf8'));
        if (
        !metadata.total ||
        !metadata.pages ||
        !metadata.currentPage ||
        !metadata.pageSize
        ) {
          throw new Error('Received incomplete metadata');
        }
        done();
      });
  });

  it('should search and return documents by title', (done) => {
    const query = getWord(testDocument.title);
    app
      .get(`/api/search/documents?q=${query}`)
      .set('x-access-token', docOwnerToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!Array.isArray(res.body)) {
          throw new Error('Expected response body to be an array');
        }
        if (res.body.length === 0) {
          throw new Error('Expected to find at least the test document');
        }
        const document = res.body[Math.floor(Math.random() * res.body.length)];
        if (
        !document.id ||
        !document.title ||
        document.content ||
        !document.type ||
        !document.access ||
        document.accesslevel ||
        !document.userId) {
          throw new Error('Response is not an array of formatted documents');
        }
        let found = false;
        res.body.forEach((result) => {
          if (result.title === testDocument.title) {
            found = true;
          }
        });
        if (!found) {
          throw new Error('Did not find the test document');
        }
        if (!res.headers['x-search-metadata']) {
          throw new Error('Expected to receive search metadata');
        }
        const metadata = JSON.parse(
          Buffer
          .from(res.headers['x-search-metadata'], 'base64')
          .toString('utf8'));
        if (
        !metadata.total ||
        !metadata.pages ||
        !metadata.currentPage ||
        !metadata.pageSize
        ) {
          throw new Error('Received incomplete metadata');
        }
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

  it("should retrieve a user's documents that the requester has access to",
  (done) => {
    app
      .get(`/api/users/${docOwner.id}/documents`)
      .set('x-access-token', docOwnerToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!Array.isArray(res.body)) {
          throw new Error('Expected response body to be an array');
        }
        const document = res.body[Math.floor(Math.random() * res.body.length)];
        if (
        !document.id ||
        (!document.title && document.title !== '') ||
        !document.type ||
        !document.access) {
          throw new Error('Response is not an array of valid documents');
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
