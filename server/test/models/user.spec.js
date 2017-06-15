import expect from 'expect';
import model from '../../models';
import { getValidUser, invalidUsers } from '../../../scripts/data-generator';

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

    it('that has a default roleId of 4', () => {
      expect(newUser.roleId).toExist();
      expect(newUser.roleId).toEqual(4);
    });

    it('that is private by default', () => {
      expect(newUser.isPrivate).toBe(true);
    });

    it('that has a unique email', (done) => {
      User.create(validUser)
      .catch((err) => {
        expect(/Someone has already signed up with that email/.test(err.message)).toBeTruthy();
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
        expect(/name cannot be null/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty name', (done) => {
      User.create(invalidUsers.emptyName())
      .catch((err) => {
        expect(/Please provide a name/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid name', (done) => {
      User.create(invalidUsers.invalidName())
      .catch((err) => {
        expect(/Please provide a valid first and last name/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no email', (done) => {
      User.create(invalidUsers.noEmail())
      .catch((err) => {
        expect(/email cannot be null/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty email', (done) => {
      User.create(invalidUsers.emptyEmail())
      .catch((err) => {
        expect(/Please provide an email/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid email', (done) => {
      User.create(invalidUsers.invalidEmail())
      .catch((err) => {
        expect(/Please provide a valid email/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no password', (done) => {
      User.create(invalidUsers.noPassword())
      .catch((err) => {
        expect(/password cannot be null/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty password', (done) => {
      User.create(invalidUsers.emptyPassword())
      .catch((err) => {
        expect(/Please provide a password/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has a password that is less than 8 characters', (done) => {
      User.create(invalidUsers.shortPassword())
      .catch((err) => {
        expect(/Passwords must be at least 8 characters/.test(err.message)).toBeTruthy();
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
