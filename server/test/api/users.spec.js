/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser, invalidUsers, getWord, getValidId } from '../../../scripts/data-generator';
import { checkUserList } from '../helpers/response-helper';

describe('Users API:', () => {
  const app = request(server);
  const newUserData = getValidUser();
  let testUser, testUserToken, superAdmin, superAdminToken, regularUser, regularUserToken,
    admin, adminToken;

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

  describe('POST /api/users', () => {
    it('should fail if name is not provided', (done) => {
      app
        .post('/api/users')
        .send(invalidUsers.noName())
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Please provide a name, email and password');
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
          expect(res.body.message).toEqual('Please provide a name, email and password');
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
          expect(res.body.message).toEqual('Please provide a name, email and password');
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
          expect(res.body.message).toEqual('Please confirm that all fields are valid');
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
          expect(res.body.message).toEqual("You're not permitted to specify your own role.");
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
          expect(res.body.message).toEqual('Please confirm that all fields are valid');
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
          expect(res.body.id).toExist();
          expect(res.body.name).toExist();
          expect(res.body.email).toExist();
          expect(res.body.roleId).toEqual(4);
          expect(res.body.password).toBe(undefined);
          expect(res.headers['x-access-token']).toExist();
          const claims = jwtDecode(res.headers['x-access-token']);
          expect(claims.id).toExist(res.body.id);
          expect(claims.roleId).toEqual(4);
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
          expect(res.body.message).toEqual('A user with that email already exists');
          done();
        });
    });
  });

  describe('PUT /api/users/:id/set-role', () => {
    const adminDetails = getValidUser();
    let secondAdmin, reviewer, secondReviewer;

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
              app.post('/api/users')
                .send(getValidUser())
                .expect(201)
                .end((err, res) => {
                  if (err) throw err;
                  reviewer = res.body;
                  app.post('/api/users')
                    .send(getValidUser())
                    .expect(201)
                    .end((err, res) => {
                      if (err) throw err;
                      secondReviewer = res.body;
                      done();
                    });
                });
            });
        });
    });

    it('should return error if request is not authenticated', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
          done();
        });
    });

    it('should return error if requester is not an admin or superadmin', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Only an administrator or higher can perform that action');
          done();
        });
    });

    it('should return error if no target role is provided', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Please provide a valid role ID');
          done();
        });
    });

    it('should return error if requester tries to create a superadministrator', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 1
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('There can only be one superadministrator');
          done();
        });
    });

    it('should return error if user is the superadministrator', (done) => {
      app.put(`/api/users/${superAdmin.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 2
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("The superadministrator's role cannot be changed");
          done();
        });
    });

    it('should return error if user already occupies the target role', (done) => {
      app.put(`/api/users/${testUser.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 4
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual(`${testUser.name} already occupies that role`);
          done();
        });
    });

    it('should promote regular user to administrator on superadministrator request', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 2
        })
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

    it('should promote regular user to administrator on administrator request', (done) => {
      app.put(`/api/users/${secondAdmin.id}/set-role`)
        .set('x-access-token', adminToken)
        .send({
          roleId: 2
        })
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

    it('should promote regular user to reviewer on superadministrator request', (done) => {
      app.put(`/api/users/${reviewer.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 3
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(reviewer.id);
          expect(res.body.name).toEqual(reviewer.name);
          expect(res.body.roleId).toEqual(3);
          done();
        });
    });

    it('should promote regular user to reviewer on administrator request', (done) => {
      app.put(`/api/users/${secondReviewer.id}/set-role`)
        .set('x-access-token', adminToken)
        .send({
          roleId: 3
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(secondReviewer.id);
          expect(res.body.name).toEqual(secondReviewer.name);
          expect(res.body.roleId).toEqual(3);
          done();
        });
    });

    it('should return error if requester tries to set their own role', (done) => {
      app.put(`/api/users/${admin.id}/set-role`)
        .set('x-access-token', adminToken)
        .send({
          roleId: 2
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You're not permitted to set your own role");
          done();
        });
    });

    it('should demote reviewer to regular user on superadministrator request', (done) => {
      app.put(`/api/users/${reviewer.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 4
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(reviewer.id);
          expect(res.body.name).toEqual(reviewer.name);
          expect(res.body.roleId).toEqual(4);
          done();
        });
    });

    it('should demote reviewer to regular user on administrator request', (done) => {
      app.put(`/api/users/${secondReviewer.id}/set-role`)
        .set('x-access-token', adminToken)
        .send({
          roleId: 4
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(secondReviewer.id);
          expect(res.body.name).toEqual(secondReviewer.name);
          expect(res.body.roleId).toEqual(4);
          done();
        });
    });

    it('should return error if administrator tries to demote another administrator', (done) => {
      app.put(`/api/users/${secondAdmin.id}/set-role`)
        .set('x-access-token', adminToken)
        .send({
          roleId: 4
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Only the superadministrator can demote administrators');
          done();
        });
    });

    it('should demote administrator on superadministrator request', (done) => {
      app.put(`/api/users/${secondAdmin.id}/set-role`)
        .set('x-access-token', superAdminToken)
        .send({
          roleId: 4
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(secondAdmin.id);
          expect(res.body.name).toEqual(secondAdmin.name);
          expect(res.body.roleId).toEqual(4);
          done();
        });
    });

    it('should return an error if user does not exist', (done) => {
      app.put(`/api/users/${getValidId()}/set-role`)
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Resource not found');
          done();
        });
    });
  });

  describe('GET /api/users', () => {
    it('should return error if request is not authenticated', (done) => {
      app.get('/api/users')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
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

    it('should use default values if limit or offset provided are negative', (done) => {
      app
        .get('/api/users?limit=-10&offset=-50')
        .set('x-access-token', superAdminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          checkUserList(res);
          done();
        });
    });

    it('should return any and all users when requested by an administrator', (done) => {
      app
        .get('/api/users')
        .set('x-access-token', adminToken)
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
          res.body.list.forEach((user) => {
            if (user.isPrivate && user.id !== testUser.id) {
              throw new Error('Retrieved a private user');
            }
          });
          done();
        });
    });
  });

  describe('GET /api/search/users', () => {
    it('should return error if request is not authenticated', (done) => {
      const query = getWord(testUser.name);
      app
        .get(`/api/search/users?q=${query}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
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
          expect(res.body).toExist();
          expect(res.body.message).toEqual('Please provide a valid query string for the search');
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
          res.body.list.forEach((result) => {
            if (result.name === testUser.name) {
              found = true;
            }
          });
          expect(found).toBeTruthy();
          done();
        });
    });

    it('should return any and all matching users on administrator request', (done) => {
      const query = getWord(testUser.name);
      app
        .get(`/api/search/users?q=${query}&limit=100`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          checkUserList(res);
          let found = false;
          res.body.list.forEach((result) => {
            if (result.name === testUser.name) {
              found = true;
            }
          });
          expect(found).toBeTruthy();
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
          res.body.list.forEach((result) => {
            if (result.name === testUser.name) {
              found = true;
            }
            if (result.isPrivate && result.id !== testUser.id) {
              throw new Error('Retrieved a private user');
            }
          });
          expect(found).toBeTruthy();
          done();
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return error if request is not authenticated', (done) => {
      app.get(`/api/users/${testUser.id}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
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
          expect(res.body.id).toEqual(testUser.id);
          expect(res.body.name).toEqual(testUser.name);
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.roleId).toEqual(testUser.roleId);
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
          expect(res.body.id).toEqual(testUser.id);
          expect(res.body.name).toEqual(testUser.name);
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.roleId).toEqual(testUser.roleId);
          done();
        });
    });

    it('should return the user on administrator request', (done) => {
      app
        .get(`/api/users/${testUser.id}`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(testUser.id);
          expect(res.body.name).toEqual(testUser.name);
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.roleId).toEqual(testUser.roleId);
          done();
        });
    });

    it('should return an error if non-admin requester tries to access a private profile', (done) => {
      app
        .get(`/api/users/${testUser.id}`)
        .set('x-access-token', regularUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You don't have access to this resource");
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
          expect(res.body.message).toEqual('Could not find that user');
          done();
        });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should return error if request is not authenticated', (done) => {
      app.put(`/api/users/${testUser.id}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
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
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
          done();
        });
    });

    it('should return error if requester is an administrator', (done) => {
      app
        .put(`/api/users/${testUser.id}`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
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
          expect(res.body.message).toEqual("Only this resource's owner can perform that action");
          done();
        });
    });

    it('should update a user on own request', (done) => {
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
          expect(res.body.name).toEqual(updatedUserData.name);
          expect(res.body.email).toEqual(updatedUserData.email);
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
          expect(res.body.message).toEqual("You're not permitted to specify your own role.");
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
          expect(res.body.message).toEqual("You're not permitted to change identifier fields");
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
          expect(res.body.id).toEqual(testUser.id);
          expect(res.body.name).toEqual(testUser.name);
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.roleId).toEqual(testUser.roleId);
          expect(res.headers['x-access-token'] === testUserToken).toBe(false);
          expect(jwtDecode(res.headers['x-access-token']).id).toEqual(testUser.id);
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
          expect(res.body.message).toEqual('Resource not found');
          done();
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return error if request is not authenticated', (done) => {
      app.delete(`/api/users/${regularUser.id}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('You need to be logged in to perform that action');
          done();
        });
    });

    it('should return error if requester is a regular user', (done) => {
      app.delete(`/api/users/${regularUser.id}`)
        .set('x-access-token', testUserToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You don't have permission to perform that action");
          done();
        });
    });

    it('should return error if requester is an administrator', (done) => {
      app.delete(`/api/users/${regularUser.id}`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual("You don't have permission to perform that action");
          done();
        });
    });

    it('should succeed on superadministrator request', (done) => {
      app
        .delete(`/api/users/${regularUser.id}`)
        .set('x-access-token', superAdminToken)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.headers['x-access-token']).toBe(undefined);
          expect(res.body.message).toEqual('User deleted successfully');
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
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.headers['x-access-token']).toEqual('');
          expect(res.body.message).toEqual('User deleted successfully');
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
          expect(res.body.message).toEqual("You can't delete the superadministrator.");
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
          expect(res.body.message).toEqual('Resource not found');
          done();
        });
    });
  });
});
