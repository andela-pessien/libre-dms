import expect from 'expect';
import model from '../../models';
import { getValidRole, invalidRoles } from '../helpers/data-helper';

const Role = model.Role;

describe('Role Model', () => {
  const validRole = getValidRole();

  describe('should create a role', () => {
    let newRole;

    beforeAll((done) => {
      Role.create(validRole)
      .then((role) => {
        newRole = role;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newRole.id).toExist();
    });

    it('that has a label', () => {
      expect(newRole.label).toExist();
    });

    it('that can be attached to many users', (done) => {
      expect(typeof newRole.getUsers).toEqual('function');
      newRole.getUsers()
      .then((users) => {
        expect(Array.isArray(users)).toBeTruthy();
        done();
      });
    });
  });

  describe('should not create a role', () => {
    it('that has no label', (done) => {
      Role.create(invalidRoles.noLabel())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty label', (done) => {
      Role.create(invalidRoles.emptyLabel())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that is not unique', (done) => {
      Role.create(validRole)
      .catch((err) => {
        expect(/SequelizeUniqueConstraintError/.test(err.name)).toBeTruthy();
        done();
      });
    });
  });
});
