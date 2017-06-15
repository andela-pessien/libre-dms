/* eslint-disable max-len */
import request from 'supertest';
import expect from 'expect';
import jwtDecode from 'jwt-decode';
import server from '../../server';
import { getValidUser } from '../../../scripts/data-generator';

describe('Authentication API:', () => {
  const app = request(server);
  const user = getValidUser();
  let authToken;

  describe('POST /api/auth/login', () => {
    it('should return error is no email is provided', (done) => {
      app
        .post('/api/auth/login')
        .send({
          password: user.password
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Please provide an email and password');
          done();
        });
    });

    it('should return error if email is invalid', (done) => {
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
          expect(res.body.message).toEqual('Please confirm that all fields are valid');
          done();
        });
    });

    it('should return error is no password is provided', (done) => {
      app
        .post('/api/auth/login')
        .send({
          email: user.email
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Please provide an email and password');
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
          expect(res.body.message).toEqual('No user with that email exists');
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
          expect(res.body.message).toEqual('Failed to authenticate with provided credentials');
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
          expect(res.body.id).toExist();
          expect(res.body.name).toExist();
          expect(res.body.email).toExist();
          expect(res.body.roleId).toEqual(1);
          expect(res.body.password).toBe(undefined);
          expect(res.headers['x-access-token']).toExist();
          const claims = jwtDecode(res.headers['x-access-token']);
          expect(claims.id).toEqual(res.body.id);
          expect(claims.roleId).toEqual(1);
          authToken = res.headers['x-access-token'];
          done();
        });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should log out a user on request', (done) => {
      app
        .post('/api/auth/logout')
        .set('x-access-token', authToken)
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.message).toEqual('Logout successful!');
          expect(res.headers['x-access-token']).toEqual('');
          done();
        });
    });
  });
});
