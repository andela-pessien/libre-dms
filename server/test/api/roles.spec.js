import request from 'supertest';
import server from '../../server';

describe('Roles API', () => {
  const app = request(server);
  let roles;

  it('should retrieve the list of roles on request', (done) => {
    app
      .get('/api/roles')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body || !Array.isArray(res.body)) {
          throw new Error('Expected roles to be returned');
        }
        const role = res.body[Math.floor(Math.random() * res.body.length)];
        if (!role.id || !role.label) {
          throw new Error('Response is not an array of roles');
        }
        roles = res.body;
        done();
      });
  });

  it('should retrieve a particular role on request', (done) => {
    const id = roles[Math.floor(Math.random() * roles.length)].id;
    app
      .get(`/api/roles/${id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body) {
          throw new Error('Expected role to be returned');
        }
        if (!res.body.id || !res.body.label) {
          throw new Error('Response is not an array of roles');
        }
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
        if (!res.body) {
          throw new Error('Expected error to be returned');
        }
        if (res.body.message !== 'Resource not found') {
          throw new Error(
            `Expected ${res.body.message} to equal 'Resource not found'`
          );
        }
        done();
      });
  });
});
