/* eslint-disable max-len */
import request from 'supertest';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser } from '../helpers/data-helper';

describe('Authentication API', () => {
  const app = request(server);
  const user = getValidUser();
  let authToken;

  it('should return appropriate error is no email is provided', (done) => {
    app
      .post('/api/auth/login')
      .send({
        password: user.password
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected error to be returned');
        }
        if (res.body.message !== 'Please provide an email and password') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Please provide an email and password'`
          );
        }
        done();
      });
  });

  it('should return appropriate error if email is invalid', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: 123,
        password: user.password
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

  it('should return appropriate error is no password is provided', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: user.email
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected error to be returned');
        }
        if (res.body.message !== 'Please provide an email and password') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Please provide an email and password'`
          );
        }
        done();
      });
  });

  it('should not log in a user that does not exist', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected error to be returned');
        }
        if (res.body.message !== 'No user with that email exists') {
          throw new Error(
            `Expected ${res.body.message} to equal 'No user with that email exists'`
          );
        }
        done();
      });
  });

  it('should not log in a user with the wrong credentials', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: process.env.SADMIN_EMAIL,
        password: user.password
      })
      .expect('Content-Type', /json/)
      .expect(403)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected error to be returned');
        }
        if (res.body.message !== 'Failed to authenticate with provided credentials') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Failed to authenticate with provided credentials'`
          );
        }
        done();
      });
  });

  it('should log in a user with the right credentials', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: process.env.SADMIN_EMAIL,
        password: process.env.SADMIN_PASSWORD
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected user to be returned');
        }
        if (
          !res.body.id ||
          !res.body.name ||
          !res.body.email ||
          !res.body.roleId ||
          res.body.password) {
          throw new Error('User not formatted properly');
        }
        if (!res.headers['x-access-token']) {
          throw new Error('Expected x-access-token header to exist');
        }
        const claims = jwtDecode(res.headers['x-access-token']);
        if (!claims.id || !claims.roleId) {
          throw new Error('Did not return token with appropriate claims');
        }
        authToken = res.headers['x-access-token'];
        done();
      });
  });

  it('should log out a user on request', (done) => {
    app
      .post('/api/auth/logout')
      .set('x-access-token', authToken)
      .send({})
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (res.body.message !== 'Logout successful!') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Logout successful!'`
          );
        }
        if (res.headers['x-access-token'] !== '') {
          throw new Error(
            `Expected ${res.headers['x-access-token']} to equal ''`
          );
        }
        done();
      });
  });
});
