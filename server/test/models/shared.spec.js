import expect from 'expect';
import model from '../../models';
import { getValidUser, getValidDoc, getValidShared, invalidShared }
  from '../../../scripts/data-generator';

const { User, Document, Shared } = model;

describe('Shared Model', () => {
  let sharedDoc;

  beforeAll((done) => {
    User.create(getValidUser())
    .then((user) => {
      Document.create(getValidDoc(user.id))
      .then((document) => {
        sharedDoc = document;
        done();
      });
    });
  });

  describe('should share a document', () => {
    let newShared;

    beforeAll((done) => {
      Shared.create(getValidShared(sharedDoc.id))
      .then((shared) => {
        newShared = shared;
        done();
      });
    });

    it('to a valid email address', () => {
      expect(newShared.email).toExist();
    });

    it('and make it only viewable by default', () => {
      expect(newShared.accesslevel).toExist();
      expect(newShared.accesslevel).toEqual('view');
    });

    it('that is the right document', () => {
      expect(newShared.documentId).toExist();
      expect(newShared.documentId).toEqual(sharedDoc.id);
    });
  });

  describe('should not share a document', () => {
    it('if no email is provided', (done) => {
      Shared.create(invalidShared.noEmail(sharedDoc.id))
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('if an empty email is provided', (done) => {
      Shared.create(invalidShared.emptyEmail(sharedDoc.id))
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('if an invalid email is provided', (done) => {
      Shared.create(invalidShared.invalidEmail(sharedDoc.id))
      .catch((err) => {
        expect(/Validation isEmail failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no reference', (done) => {
      Shared.create(invalidShared.noDocument())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid reference', (done) => {
      Shared.create(invalidShared.invalidDocument())
      .catch((err) => {
        expect(/invalid input syntax/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that does not exist', (done) => {
      Shared.create(invalidShared.nonExistentDocument())
      .catch((err) => {
        expect(/SequelizeForeignKeyConstraintError/.test(err.name))
          .toBeTruthy();
        done();
      });
    });

    it('if an invalid access level is provided', (done) => {
      Shared.create(invalidShared.invalidAccessLevel(sharedDoc.id))
      .catch((err) => {
        expect(/invalid input value/.test(err.message)).toBeTruthy();
        done();
      });
    });
  });
});
