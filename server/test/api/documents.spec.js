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
        res.body.userName !== docOwner.name) {
          throw new Error('Document not assigned to the right owner');
        }
        testDocument = res.body;
        done();
      });
  });
});
