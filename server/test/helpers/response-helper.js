import expect from 'expect';

const checkMetadata = (metadata) => {
  expect(typeof metadata.total).toEqual('number');
  expect(typeof metadata.pages).toEqual('number');
  expect(typeof metadata.currentPage).toEqual('number');
  expect(typeof metadata.pageSize).toEqual('number');
};

export const checkDocumentList = (res) => {
  expect(Array.isArray(res.body.list)).toBeTruthy();
  res.body.list.forEach((document) => {
    expect(document.id).toExist();
    expect(document.title).toExist();
    expect(document.type).toExist();
    expect(document.access).toExist();
  });
  checkMetadata(res.body.metadata);
};

export const checkUserList = (res) => {
  expect(Array.isArray(res.body.list)).toBeTruthy();
  res.body.list.forEach((user) => {
    expect(user.id).toExist();
    expect(user.name).toExist();
    expect(user.password).toBe(undefined);
  });
  checkMetadata(res.body.metadata);
};
