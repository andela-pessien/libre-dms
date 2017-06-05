/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import server from '../../server';

describe('API', () => {
  const app = request(server);
  let superAdminToken;

  beforeAll((done) => {
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
        done();
      });
  });

  it('should return appropriate stock phrase on /api access', (done) => {
    app
      .get('/api')
      .expect('Content-Type', /text/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).toEqual('This is where the LibreDMS API is hosted');
        done();
      });
  });

  it('should return error if access token is invalid', (done) => {
    app
      .get('/api/users')
      .set('x-access-token', (Math.random() * 100).toString())
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.message).toEqual('Access token is invalid');
        done();
      });
  });

  it('should return error if resource identifier is invalid', (done) => {
    app
      .get(`/api/users/${Math.floor(Math.random() * 100)}`)
      .set('x-access-token', superAdminToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.message).toEqual('Invalid resource identifier');
        app
          .get(`/api/documents/${Math.floor(Math.random() * 100)}`)
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) throw err;
            expect(res.body.message).toEqual('Invalid resource identifier');
            done();
          });
      });
  });
});
