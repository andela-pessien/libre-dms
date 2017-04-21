import expect from 'expect';
import model from '../../models/';

describe('Models', () => {
  it('should include a Role model', () => {
    expect(model.Role).toExist();
  });

  it('should include a User model', () => {
    expect(model.User).toExist();
  });

  it('should include a Document model', () => {
    expect(model.Document).toExist();
  });

  it('should include a Shared model', () => {
    expect(model.Shared).toExist();
  });

  it('should include a Comment model', () => {
    expect(model.Comment).toExist();
  });

  it('should include an Organisation model', () => {
    expect(model.Organisation).toExist();
  });

  it('should include a Department model', () => {
    expect(model.Department).toExist();
  });
});
