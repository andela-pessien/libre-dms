import expect from 'expect';
import model from '../../models';
import { getValidOrg, getValidDomainOrg, invalidOrgs }
  from '../../../scripts/data-generator';

const { Organisation } = model;

describe('Organisation Model', () => {
  describe('should create an organisation', () => {
    let newOrg;

    beforeAll((done) => {
      Organisation.create(getValidOrg())
      .then((organisation) => {
        newOrg = organisation;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newOrg.id).toExist();
    });

    it('that has a name', () => {
      expect(newOrg.name).toExist();
    });

    it('that is publicly listed by default', () => {
      expect(newOrg.privateorg).toBe(false);
    });

    it('that allows the creation of private documents by default', () => {
      expect(newOrg.privatedocs).toBe(false);
    });

    it('that can have many users', (done) => {
      expect(typeof newOrg.getUsers).toEqual('function');
      newOrg.getUsers()
      .then((users) => {
        expect(Array.isArray(users)).toBeTruthy();
        done();
      });
    });

    it('that can have many documents', (done) => {
      expect(typeof newOrg.getDocuments).toEqual('function');
      newOrg.getDocuments()
      .then((documents) => {
        expect(Array.isArray(documents)).toBeTruthy();
        done();
      });
    });

    it('that can have many departments', (done) => {
      expect(typeof newOrg.getDepartments).toEqual('function');
      newOrg.getDepartments()
      .then((departments) => {
        expect(Array.isArray(departments)).toBeTruthy();
        done();
      });
    });
  });

  describe('should not create an organisation', () => {
    it('that has no name', (done) => {
      Organisation.create(invalidOrgs.noName())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty name', (done) => {
      Organisation.create(invalidOrgs.emptyName())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty domain', (done) => {
      Organisation.create(invalidOrgs.emptyDomain())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an invalid domain', (done) => {
      Organisation.create(invalidOrgs.invalidDomain())
      .catch((err) => {
        expect(/Validation isDomain failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that does not have a unique domain', (done) => {
      Organisation.create(getValidDomainOrg())
      .then((organisation) => {
        Organisation.create(getValidDomainOrg(organisation.domain))
        .catch((err) => {
          expect(/SequelizeUniqueConstraintError/.test(err.name)).toBeTruthy();
          done();
        });
      });
    });
  });
});
