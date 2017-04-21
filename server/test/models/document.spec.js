import expect from 'expect';
import model from '../../models';
import { getValidUser, getValidDoc, invalidDocs } from '../helpers/data-helper';

const { User, Document } = model;

describe('Document Model', () => {
  let docOwner;

  beforeAll((done) => {
    User.create(getValidUser())
    .then((user) => {
      docOwner = user;
      done();
    });
  });

  describe('should create a document', () => {
    let newDoc;

    beforeAll((done) => {
      Document.create(getValidDoc(docOwner.id))
      .then((document) => {
        newDoc = document;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newDoc.id).toExist();
    });

    it('that has a title', () => {
      expect(newDoc.title).toExist();
    });

    it('that has content', () => {
      expect(newDoc.content).toExist();
    });

    it('that is type "text" by default', () => {
      expect(newDoc.type).toExist();
      expect(newDoc.type).toEqual('text');
    });

    it('that is private by default', () => {
      expect(newDoc.access).toExist();
      expect(newDoc.access).toEqual('private');
    });

    it('that is only viewable by non-owners by default', () => {
      expect(newDoc.accesslevel).toExist();
      expect(newDoc.accesslevel).toEqual('view');
    });

    it('that is not shared by default', () => {
      expect(newDoc.shared).toBe(false);
    });

    it('that has the right owner', () => {
      expect(newDoc.userId).toExist();
      expect(newDoc.userId).toEqual(docOwner.id);
    });

    it('that can have many comments', (done) => {
      expect(typeof newDoc.getComments).toEqual('function');
      newDoc.getComments()
      .then((comments) => {
        expect(Array.isArray(comments)).toBeTruthy();
        done();
      });
    });

    it('that can be shared with many people', (done) => {
      expect(typeof newDoc.getShareds).toEqual('function');
      newDoc.getShareds()
      .then((shareds) => {
        expect(Array.isArray(shareds)).toBeTruthy();
        done();
      });
    });
  });

  describe('should not create a document', () => {
    it('that has no title', (done) => {
      Document.create(invalidDocs.noTitle(docOwner.id))
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no owner', (done) => {
      Document.create(invalidDocs.noOwner())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has a nonexistent owner', (done) => {
      Document.create(invalidDocs.nonExistentOwner())
      .catch((err) => {
        expect(/SequelizeForeignKeyConstraintError/.test(err.name))
          .toBeTruthy();
        done();
      });
    });

    it('that has an invalid owner', (done) => {
      Document.create(invalidDocs.invalidOwner())
      .catch((err) => {
        expect(/invalid input syntax/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid type', (done) => {
      Document.create(invalidDocs.invalidType(docOwner.id))
      .catch((err) => {
        expect(/invalid input value/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid access', (done) => {
      Document.create(invalidDocs.invalidAccess(docOwner.id))
      .catch((err) => {
        expect(/invalid input value/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid access level', (done) => {
      Document.create(invalidDocs.invalidAccessLevel(docOwner.id))
      .catch((err) => {
        expect(/invalid input value/.test(err.message)).toBeTruthy();
        done();
      });
    });
  });
});
