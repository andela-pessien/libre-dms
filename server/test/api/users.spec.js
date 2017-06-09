/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser, invalidUsers, getWord, getValidId } from '../helpers/data-helper';
import { checkUserList } from '../helpers/response-helper';

describe('Users API', () => {
  const app = request(server);
  const newUserData = getValidUser();
  let testUser, testUserToken, superAdmin, superAdminToken, regularUser, regularUserToken,
    admin, adminToken, secondAdmin;

  beforeAll((done) => {
    app
      .post('/api/auth/login')
      .send({
        email: process.env.SADMIN_EMAIL,
        password: process.env.SADMIN_PASSWORD
      })
      .end((err, res) => {
        if (err) throw err;
        superAdmin = res.body;
        superAdminToken = res.headers['x-access-token'];
        app
          .post('/api/users')
          .send(getValidUser())
          .end((err, res) => {
            if (err) throw err;
            regularUser = res.body;
            regularUserToken = res.headers['x-access-token'];
            done();
          });
      });
  });

  describe('Creating a user', () => {
    it('should fail if name is not provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.noName())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please provide a name, email and password') {
            throw new Error(`Expected ${res.body.message} to equal 'Please provide a name, email and password'`);
          }
          done();
        });
    });

    it('should fail if email is not provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.noEmail())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please provide a name, email and password') {
            throw new Error(`Expected ${res.body.message} to equal 'Please provide a name, email and password'`);
          }
          done();
        });
    });

    it('should fail if password is not provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.noPassword())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please provide a name, email and password') {
            throw new Error(`Expected ${res.body.message} to equal 'Please provide a name, email and password'`);
          }
          done();
        });
    });

    it('should fail if invalid email is provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.invalidEmail())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please confirm that all fields are valid') {
            throw new Error(`Expected ${res.body.message} to equal 'Please confirm that all fields are valid'`);
          }
          done();
        });
    });

    it('should fail if user tries to set their own role', (done) => {
      app
        .post('/api/users')
        .send(getValidUser(4))
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You're not permitted to specify your own role.") {
            throw new Error(`Expected ${res.body.message} to equal "You're not permitted to specify your own role."`);
          }
          done();
        });
    });

    it('should fail if invalid email is provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.invalidEmail())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Please confirm that all fields are valid') {
            throw new Error(`Expected ${res.body.message} to equal 'Please confirm that all fields are valid'`);
          }
          done();
        });
    });

    it('should succeed and sign in a user if all validations pass', (done) => {
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

    it('should fail if user with that email already exists', (done) => {
      app
        .post('/api/users')
        .send({ ...getValidUser(), email: testUser.email })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'A user with that email already exists') {
            throw new Error(`Expected ${res.body.message} to equal 'A user with that email already exists'`);
          }
          done();
        });
    });
  });

  describe('PUT /api/users/:id/promote', () => {
    const adminDetails = getValidUser();
    beforeAll((done) => {
      app.post('/api/users')
        .send(adminDetails)
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          admin = res.body;
          app.post('/api/users')
            .send(getValidUser())
            .expect(201)
            .end((err, res) => {
              if (err) throw err;
              secondAdmin = res.body;
              done();
            });
        });
    });

    it('should return error if request is not authenticated', (done) => {
      app.put(`/api/users/${admin.id}/promote`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
          done();
        });
    });

    it('should return error if requester is not an admin or superadmin', (done) => {
      app.put(`/api/users/${admin.id}/promote`)
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Only an administrator or higher can perform that action');
          done();
        });
    });

    it('should promote user to administrator on superadministrator request', (done) => {
      app.put(`/api/users/${admin.id}/promote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(admin.id);
          expect(res.body.name).toEqual(admin.name);
          expect(res.body.roleId).toEqual(2);
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
              done();
            });
        });
    });

    it('should promote user to administrator on administrator request', (done) => {
      app.put(`/api/users/${secondAdmin.id}/promote`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(secondAdmin.id);
          expect(res.body.name).toEqual(secondAdmin.name);
          expect(res.body.roleId).toEqual(2);
          done();
        });
    });

    it('should return error if user is already an administrator', (done) => {
      app.put(`/api/users/${secondAdmin.id}/promote`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual(`${secondAdmin.name} is already an administrator`);
          done();
        });
    });

    it('should return error if user is the superadministrator', (done) => {
      app.put(`/api/users/${superAdmin.id}/promote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('This user is already the superadministrator');
          done();
        });
    });

    it('should return an error if user does not exist', (done) => {
      app
        .put(`/api/users/${getValidId()}/promote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          try {
            expect(res.body.message).toEqual('Resource not found');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });
  });

  describe('Listing users', () => {
    it('should return error if request is not authenticated', (done) => {
      app.get('/api/users')
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
        .get('/api/users?limit=-10&offset=-50')
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

    it('should return any and all users when requested by the superadmin', (done) => {
      app
        .get('/api/users')
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkUserList(res);
          done();
        });
    });

    it('should return self and only publicly-listed users on regular request', (done) => {
      app
        .get('/api/users?limit=100')
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkUserList(res);
          res.body.forEach((user) => {
            if (user.isPrivate && user.id !== testUser.id) {
              throw new Error('Retrieved a private user');
            }
          });
          done();
        });
    });
  });

  describe('Searching for users by name', () => {
    it('should return error if request is not authenticated', (done) => {
      const query = getWord(testUser.name);
      app
        .get(`/api/search/users?q=${query}`)
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
        .get('/api/search/users')
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

    it('should return any and all matching users on superadministrator request', (done) => {
      const query = getWord(testUser.name);
      app
        .get(`/api/search/users?q=${query}&limit=100`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkUserList(res);
          let found = false;
          res.body.forEach((result) => {
            if (result.name === testUser.name) {
              found = true;
            }
          });
          if (!found) {
            throw new Error('Did not find the test user');
          }
          done();
        });
    });

    it('should return self (if matching) and only publicly-listed users on regular request', (done) => {
      const query = getWord(testUser.name);
      app
        .get(`/api/search/users?query=${query}&limit=100`)
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkUserList(res);
          let found = false;
          res.body.forEach((result) => {
            if (result.name === testUser.name) {
              found = true;
            }
            if (result.isPrivate && result.id !== testUser.id) {
              throw new Error('Retrieved a private user');
            }
          });
          if (!found) {
            throw new Error('Did not find the test user');
          }
          done();
        });
    });
  });

  describe('Retrieving a user', () => {
    it('should return error if request is not authenticated', (done) => {
      app.get(`/api/users/${testUser.id}`)
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

    it('should return the user on own request', (done) => {
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

    it('should return the user on superadministrator request', (done) => {
      app
        .get(`/api/users/${testUser.id}`)
        .set('x-access-token', superAdminToken)
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

    it('should return an error if requester does not have access', (done) => {
      app
        .get(`/api/users/${testUser.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You don't have access to this resource") {
            throw new Error(`Expected ${res.body.message} to equal "You don't have access to this resource"`);
          }
          done();
        });
    });

    it('should return an error if user does not exist', (done) => {
      app
        .get(`/api/users/${getValidId()}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== 'Could not find that user') {
            throw new Error(`Expected ${res.body.message} to equal 'Could not find that user'"`);
          }
          done();
        });
    });
  });

  describe('Updating a user', () => {
    it('should return error if request is not authenticated', (done) => {
      app.put(`/api/users/${testUser.id}`)
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

    it('should return error if requester is not the user', (done) => {
      app
        .put(`/api/users/${testUser.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "Only this resource's owner can perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "Only this resource's owner can perform that action"`);
          }
          done();
        });
    });

    it('should return error even if requester is the superadministrator', (done) => {
      app
        .put(`/api/users/${testUser.id}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "Only this resource's owner can perform that action") {
            throw new Error(`Expected ${res.body.message} to equal "Only this resource's owner can perform that action"`);
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

    it('should fail if user tries to set their own role', (done) => {
      app
        .put(`/api/users/${testUser.id}`)
        .set('x-access-token', testUserToken)
        .send(getValidUser(4))
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You're not permitted to specify your own role.") {
            throw new Error(`Expected ${res.body.message} to equal "You're not permitted to specify your own role."`);
          }
          done();
        });
    });

    it('should fail if user tries to change their ID', (done) => {
      app
        .put(`/api/users/${testUser.id}`)
        .send({ id: getValidId() })
        .set('x-access-token', testUserToken)
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

    it('should change the access token for a user if the password was changed', (done) => {
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

    it('should return an error if user does not exist', (done) => {
      app
        .put(`/api/users/${getValidId()}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          try {
            expect(res.body.message).toEqual('Resource not found');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });
  });

  describe('PUT /api/users/:id/demote', () => {
    it('should return error if request is not authenticated', (done) => {
      app.put(`/api/users/${secondAdmin.id}/demote`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
          done();
        });
    });

    it('should return error if requester is a regular user', (done) => {
      app.put(`/api/users/${secondAdmin.id}/demote`)
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Only the superadministrator can perform that action');
          done();
        });
    });

    it('should return error if requester is an administrator', (done) => {
      app.put(`/api/users/${secondAdmin.id}/demote`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Only the superadministrator can perform that action');
          done();
        });
    });

    it('should demote user from administrator on superadministrator request', (done) => {
      app.put(`/api/users/${secondAdmin.id}/demote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(secondAdmin.id);
          expect(res.body.name).toEqual(secondAdmin.name);
          expect(res.body.roleId).toEqual(3);
          done();
        });
    });

    it('should return error if user is already a regular user', (done) => {
      app.put(`/api/users/${secondAdmin.id}/demote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual(`${secondAdmin.name} is already a regular user`);
          done();
        });
    });

    it('should return error if user is the superadministrator', (done) => {
      app.put(`/api/users/${superAdmin.id}/demote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You can't demote the superadministrator");
          done();
        });
    });

    it('should return an error if user does not exist', (done) => {
      app
        .put(`/api/users/${getValidId()}/demote`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          try {
            expect(res.body.message).toEqual('Resource not found');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });
  });

  describe('Deleting a user', () => {
    it('should return error if request is not authenticated', (done) => {
      app.delete(`/api/users/${regularUser.id}`)
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

    it('should return error if requester is not the user or superadmin', (done) => {
      app.delete(`/api/users/${regularUser.id}`)
        .set('x-access-token', testUserToken)
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

    it('should succeed on superadministrator request', (done) => {
      app
        .delete(`/api/users/${regularUser.id}`)
        .set('x-access-token', superAdminToken)
        .expect(204)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.headers['x-access-token']).toBe(undefined);
          } catch (err) {
            throw err;
          }
          app
            .get(`/api/users/${regularUser.id}`)
            .set('x-access-token', superAdminToken)
            .expect(404, done());
        });
    });

    it('should succeed and also delete token on own request', (done) => {
      app
        .delete(`/api/users/${testUser.id}`)
        .set('x-access-token', testUserToken)
        .expect(204)
        .end((err, res) => {
          if (err) throw err;
          try {
            expect(res.headers['x-access-token']).toEqual('');
          } catch (err) {
            throw err;
          }
          app
            .get(`/api/users/${testUser.id}`)
            .set('x-access-token', superAdminToken)
            .expect(404, done());
        });
    });

    it('should return error if user to be deleted is the superadmin', (done) => {
      app.delete(`/api/users/${superAdmin.id}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          if (res.body.message !== "You can't delete the superadministrator.") {
            throw new Error(`Expected ${res.body.message} to equal "You can't delete the superadministrator."`);
          }
          done();
        });
    });

    it('should return an error if user does not exist', (done) => {
      app
        .delete(`/api/users/${getValidId()}`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          if (!res.body) {
            throw new Error('Expected error to be returned');
          }
          try {
            expect(res.body.message).toEqual('Resource not found');
          } catch (err) {
            if (err) throw err;
          }
          done();
        });
    });
  });
});
