import request from 'supertest';
import expect from 'expect';
import server from '../../server';

describe('Roles API', () => {
  const app = request(server);
  let roles;

  describe('GET /api/roles', () => {
    it('should retrieve the list of roles on request', (done) => {
      app
        .get('/api/roles')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(Array.isArray(res.body)).toBeTruthy();
          res.body.forEach((role) => {
            expect(role.id).toExist();
            expect(role.label).toExist();
          });
          roles = res.body;
          done();
        });
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should retrieve a particular role on request', (done) => {
      const role = roles[Math.floor(Math.random() * roles.length)];
      app
        .get(`/api/roles/${role.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.id).toEqual(role.id);
          expect(res.body.label).toEqual(role.label);
          done();
        });
    });

    it('should return appropriate error if role does not exist', (done) => {
      const id = roles.length + 10;
      app
        .get(`/api/roles/${id}`)
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
