import expect from 'expect';
import model from '../../models';
import { getValidOrg, getValidDep, invalidDeps } from '../helpers/data-helper';

const { Organisation, Department } = model;

describe('Department Model', () => {
  let parentOrg;

  beforeAll((done) => {
    Organisation.create(getValidOrg())
    .then((organisation) => {
      parentOrg = organisation;
      done();
    });
  });

  describe('should create a department', () => {
    let newDep;

    beforeAll((done) => {
      Department.create(getValidDep(parentOrg.id))
      .then((department) => {
        newDep = department;
        done();
      });
    });

    it('that has an ID', () => {
      expect(newDep.id).toExist();
    });

    it('that has a name', () => {
      expect(newDep.name).toExist();
    });

    it('that belongs to the right organisation', () => {
      expect(newDep.organisationId).toExist();
      expect(newDep.organisationId).toEqual(parentOrg.id);
    });

    it('that has a unique name within its organisation', (done) => {
      Department.create({
        name: newDep.name,
        organisationId: parentOrg.id
      })
      .catch((err) => {
        expect(/Validation isUniqueWithinOrg failed/.test(err.message))
          .toBeTruthy();
        done();
      });
    });

    it("if it doesn't match any departments in its organisation", (done) => {
      Department.create(getValidDep(parentOrg.id))
      .then((department) => {
        expect(department.name).toExist();
        expect(department.organisationId).toEqual(parentOrg.id);
        done();
      });
    });

    it('that is not necessarily unique across organisations', (done) => {
      Organisation.create(getValidOrg())
      .then((organisation) => {
        Department.create({
          name: newDep.name,
          organisationId: organisation.id
        })
        .then((department) => {
          expect(department.id).toExist();
          done();
        });
      });
    });

    it('that can have many users', (done) => {
      expect(typeof newDep.getUsers).toEqual('function');
      newDep.getUsers()
      .then((users) => {
        expect(Array.isArray(users)).toBeTruthy();
        done();
      });
    });

    it('that can have many documents', (done) => {
      expect(typeof newDep.getDocuments).toEqual('function');
      newDep.getDocuments()
      .then((documents) => {
        expect(Array.isArray(documents)).toBeTruthy();
        done();
      });
    });
  });

  describe('should not create a department', () => {
    it('that has no name', (done) => {
      Department.create(invalidDeps.noName())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that has an empty name', (done) => {
      Department.create(invalidDeps.emptyName())
      .catch((err) => {
        expect(/Validation notEmpty failed/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that does not belong to an organisation', (done) => {
      Department.create(invalidDeps.noOrganisation())
      .catch((err) => {
        expect(/notNull Violation/.test(err.message)).toBeTruthy();
        done();
      });
    });

    it('that belongs to a nonexistent organisation', (done) => {
      Department.create(invalidDeps.nonExistentOrganisation())
      .catch((err) => {
        expect(/SequelizeForeignKeyConstraintError/.test(err.name))
          .toBeTruthy();
        done();
      });
    });

    it('that belongs to an invalid organisation', (done) => {
      Department.create(invalidDeps.invalidOrganisation())
      .catch((err) => {
        expect(/invalid input syntax/.test(err.message)).toBeTruthy();
        done();
      });
    });
  });
});
