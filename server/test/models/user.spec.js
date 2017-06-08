import expect from 'expect';
import model from '../../models';
import { getValidUser, invalidUsers } from '../helpers/data-helper';

const { User } = model;

describe('User Model', () => {
  const validUser = getValidUser();

  describe('should create a user', () => {
    let newUser;

    beforeAll((done) => {
      User.create(validUser)
      .then((user) => {
        newUser = user;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newUser.id).toExist();
    });

    it('that has a name', () => {
      expect(newUser.name).toExist();
    });

    it('that has an email', () => {
      expect(newUser.email).toExist();
    });

    it('that has a hashed password', () => {
      expect(newUser.password).toExist();
      expect(newUser.password.length).toEqual(60);
      expect(/^\$2a\$10/.test(newUser.password)).toBeTruthy();
    });

    it('that has a default roleId of 3', () => {
      expect(newUser.roleId).toExist();
      expect(newUser.roleId).toEqual(3);
    });

    it('that is private by default', () => {
      expect(newUser.isPrivate).toBe(true);
    });

    it('that has a unique email', (done) => {
      User.create(validUser)
      .catch((err) => {
        expect(/SequelizeUniqueConstraintError/.test(err.name)).toBeTruthy();
        done();
      });
    });

    it('that can have many documents', (done) => {
      expect(typeof newUser.getDocuments).toEqual('function');
      newUser.getDocuments()
      .then((documents) => {
        expect(Array.isArray(documents)).toBeTruthy();
        done();
      });
    });

    it('that can have many comments', (done) => {
      expect(typeof newUser.getComments).toEqual('function');
      newUser.getComments()
      .then((comments) => {
        expect(Array.isArray(comments)).toBeTruthy();
        done();
      });
    });
  });

  describe('should not create a user', () => {
    it('that has no name', (done) => {
      User.create(invalidUsers.noName())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty name', (done) => {
      User.create(invalidUsers.emptyName())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no email', (done) => {
      User.create(invalidUsers.noEmail())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty email', (done) => {
      User.create(invalidUsers.emptyEmail())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid email', (done) => {
      User.create(invalidUsers.invalidEmail())
      .catch((err) => {
        expect(/Validation isEmail failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no password', (done) => {
      User.create(invalidUsers.noPassword())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty password', (done) => {
      User.create(invalidUsers.emptyPassword())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has a nonexistent role', (done) => {
      User.create(getValidUser(100))
      .catch((err) => {
        expect(/SequelizeForeignKeyConstraintError/.test(err.name))
          .toBeTruthy();
        done();
      });
    });
  });
});
