import request from 'supertest';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser } from '../helpers/data-helper';

describe('Users API', () => {
  const app = request(server);
  const newUser = getValidUser();
  let userToken;
  let userDecoded;

  it('should create and sign in a user if all validations pass', (done) => {
    app
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        if (res.body.message !== 'Signup successful!') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Signup successful!'`
          );
        }
        if (!res.headers['x-access-token']) {
          throw new Error('Expected x-access-token header to exist');
        }
        userDecoded = jwtDecode(res.headers['x-access-token']);
        if (
          !userDecoded.id ||
          !userDecoded.name ||
          !userDecoded.email ||
          !userDecoded.roleId ||
          userDecoded.password) {
          throw new Error('User not formatted properly');
        }
        done();
      });
  });

  it('should log out a user on request', (done) => {
    app
      .post('/api/auth/logout')
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

  it('should log in a user with the right credentials', (done) => {
    app
      .post('/api/auth/login')
      .send({
        email: newUser.email,
        password: newUser.password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (res.body.message !== 'Login successful!') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Login successful!'`
          );
        }
        if (!res.headers['x-access-token']) {
          throw new Error('Expected x-access-token header to exist');
        }
        const decoded = jwtDecode(res.headers['x-access-token']);
        if (decoded.id !== userDecoded.id) {
          throw new Error('Did not log in the right user');
        }
        userToken = res.headers['x-access-token'];
        done();
      });
  });

  it('should retrieve a user record when the owner requests it', (done) => {
    app
      .get(`/api/users/${userDecoded.id}`)
      .set('x-access-token', userToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected user to be retrieved');
        }
        if (
          res.body.id !== userDecoded.id ||
          res.body.name !== userDecoded.name ||
          res.body.email !== userDecoded.email ||
          res.body.roleId !== userDecoded.roleId
        ) {
          throw new Error('Did not retrieve the right user');
        }
        done();
      });
  });
});
