import request from 'supertest';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser, getWord } from '../helpers/data-helper';

describe('Users Controller', () => {
  const app = request(server);
  const newUserData = getValidUser();
  let testUser;
  let testUserToken;

  it('should create and sign in a user if all validations pass', (done) => {
    app
      .post('/api/users')
      .send(newUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected created user to be returned');
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
        if (jwtDecode(res.headers['x-access-token']).id !== res.body.id) {
          throw new Error('Access token does not correspond to user');
        }
        testUser = res.body;
        testUserToken = res.headers['x-access-token'];
        done();
      });
  });

  it('should log out a user on request', (done) => {
    app
      .post('/api/auth/logout')
      .set('x-access-token', testUserToken)
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
        email: newUserData.email,
        password: newUserData.password
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
        if (jwtDecode(res.headers['x-access-token']).id !== testUser.id) {
          throw new Error('Did not log in the right user');
        }
        testUserToken = res.headers['x-access-token'];
        done();
      });
  });

  it('should search and return users by name', (done) => {
    const query = getWord(testUser.name);
    app
      .get(`/api/search/users?q=${query}`)
      .set('x-access-token', testUserToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (!Array.isArray(res.body)) {
          throw new Error('Expected response body to be an array');
        }
        if (res.body.length === 0) {
          throw new Error('Expected to find at least the test user');
        }
        const user = res.body[Math.floor(Math.random() * res.body.length)];
        if (
        !user.id ||
        !user.name ||
        user.email ||
        user.roleId ||
        user.password) {
          throw new Error('Response is not an array of formatted users');
        }
        let found = false;
        res.body.forEach((result) => {
          if (result.name === testUser.name) {
            found = true;
          }
        });
        if (!found) {
          throw new Error('Did not find the test user');
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

  it('should retrieve a user record on authenticated request', (done) => {
    app
      .get(`/api/users/${testUser.id}`)
      .set('x-access-token', testUserToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected user to be retrieved');
        }
        if (
          res.body.id !== testUser.id ||
          res.body.name !== testUser.name ||
          res.body.email !== testUser.email ||
          res.body.roleId !== testUser.roleId
        ) {
          throw new Error('Did not retrieve the right user');
        }
        done();
      });
  });

  it('should update a user if the requester has access', (done) => {
    const updatedUserData = getValidUser();
    app
      .put(`/api/users/${testUser.id}`)
      .set('x-access-token', testUserToken)
      .send({
        name: updatedUserData.name,
        email: updatedUserData.email
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected updated user to be returned');
        }
        if (
          res.body.name !== updatedUserData.name ||
          res.body.email !== updatedUserData.email
        ) {
          throw new Error('User not updated properly');
        }
        testUser = res.body;
        done();
      });
  });

  it('should change the access token for a user if the password was changed',
  (done) => {
    const updatedUserData = getValidUser();
    app
      .put(`/api/users/${testUser.id}`)
      .set('x-access-token', testUserToken)
      .send({
        password: updatedUserData.password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected updated user to be returned');
        }
        if (!res.headers['x-access-token']) {
          throw new Error('Expected x-access-token header to exist');
        }
        if (res.headers['x-access-token'] === testUserToken) {
          throw new Error('Expected access token to be refreshed');
        }
        if (jwtDecode(res.headers['x-access-token']).id !== testUser.id) {
          throw new Error('Access token does not correspond to user');
        }
        testUserToken = res.headers['x-access-token'];
        done();
      });
  });

  it('should delete a user and their token on authenticated request',
  (done) => {
    app
      .delete(`/api/users/${testUser.id}`)
      .set('x-access-token', testUserToken)
      .expect(204)
      .end((err, res) => {
        if (err) throw err;
        if (res.headers['x-access-token'] !== '') {
          throw new Error(
            `Expected ${res.headers['x-access-token']} to equal ''`
          );
        }
        testUserToken = res.headers['x-access-token'];
        done();
      });
  });
});
