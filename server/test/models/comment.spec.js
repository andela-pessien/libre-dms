import expect from 'expect';
import model from '../../models';
import { getValidUser, getValidDoc, getValidComment, invalidComments }
  from '../../../scripts/data-generator';

const { User, Document, Comment } = model;

describe('Comment Model', () => {
  let docOwner;
  let commenter;
  let commentedDoc;

  beforeAll((done) => {
    User.create(getValidUser())
    .then((firstUser) => {
      docOwner = firstUser;
      User.create(getValidUser())
      .then((secondUser) => {
        commenter = secondUser;
        Document.create(getValidDoc(docOwner.id))
        .then((document) => {
          commentedDoc = document;
          done();
        });
      });
    });
  });

  describe('should create a comment', () => {
    let newComment;

    beforeAll((done) => {
      Comment.create(getValidComment(commenter.id, commentedDoc.id))
      .then((comment) => {
        newComment = comment;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newComment.id).toExist();
    });

    it('that has content', () => {
      expect(newComment.content).toExist();
    });

    it('that belongs to the right user', () => {
      expect(newComment.userId).toExist();
      expect(newComment.userId).toEqual(commenter.id);
    });

    it('that is attached to the right document', () => {
      expect(newComment.documentId).toExist();
      expect(newComment.documentId).toEqual(commentedDoc.id);
    });
  });

  describe('should not create a comment', () => {
    it('that has no content', (done) => {
      Comment.create(invalidComments.noContent(commenter.id, commentedDoc.id))
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has empty content', (done) => {
      Comment.create(invalidComments
        .emptyContent(commenter.id, commentedDoc.id))
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has no commenter', (done) => {
      Comment.create(invalidComments.noCommenter(commentedDoc.id))
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that is not attached to a document', (done) => {
      Comment.create(invalidComments.noDocument(commenter.id))
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });
  });
});
