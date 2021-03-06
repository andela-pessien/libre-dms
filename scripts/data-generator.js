import faker from 'faker';
import uuid from 'uuid/v4';
import Delta from 'quill-delta';

export const defaultRoles = [
  {
    label: 'Superadministrator'
  }, {
    label: 'Administrator'
  }, {
    label: 'Reviewer'
  }, {
    label: 'Regular'
  }
];

export const superAdmin = {
  name: process.env.SADMIN_NAME,
  email: process.env.SADMIN_EMAIL,
  password: process.env.SADMIN_PASSWORD,
  roleId: 1
};

export const getValidId = () => uuid();

export const getValidRole = () => ({
  label: faker.lorem.word()
});

export const invalidRoles = {
  noLabel() {
    return {
      title: faker.lorem.words()
    };
  },
  emptyLabel() {
    return {
      label: ''
    };
  }
};

export const getValidUser = roleId => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password(),
  roleId
});

export const getValidPublicUser = roleId => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  password: faker.internet.password(),
  roleId,
  isPrivate: false
});

export const invalidUsers = {
  noName() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  },
  noEmail() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      password: faker.internet.password()
    };
  },
  noPassword() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email()
    };
  },
  emptyName() {
    return {
      name: '',
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  },
  emptyEmail() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: '',
      password: faker.internet.password()
    };
  },
  emptyPassword() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: ''
    };
  },
  shortPassword() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password().substr(0, 5)
    };
  },
  invalidName() {
    return {
      name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  },
  invalidEmail() {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.name.findName(),
      password: faker.internet.password()
    };
  }
};

export const getValidDoc = (userId, access, accesslevel) => ({
  title: faker.company.catchPhrase(),
  content: faker.lorem.paragraphs(),
  access,
  accesslevel,
  userId
});

export const getValidQuillDoc = (userId, access, accesslevel) => ({
  title: faker.company.catchPhrase(),
  content: new Delta([{ insert: faker.lorem.paragraphs() }]),
  access,
  accesslevel,
  userId
});

export const invalidDocs = {
  noTitle(userId) {
    return {
      content: faker.lorem.paragraphs(),
      userId
    };
  },
  emptyTitle(userId) {
    return {
      title: '',
      content: faker.lorem.paragraphs(),
      userId
    };
  },
  noOwner() {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
    };
  },
  nonExistentOwner() {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      userId: uuid()
    };
  },
  invalidOwner() {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      userId: faker.lorem.word()
    };
  },
  invalidType(userId) {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      type: faker.lorem.words(),
      userId
    };
  },
  invalidAccess(userId) {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      access: faker.lorem.words(),
      userId
    };
  },
  invalidAccessLevel(userId) {
    return {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      accesslevel: faker.lorem.words(),
      userId
    };
  }
};

export const getValidShared = (documentId, accesslevel) => ({
  email: faker.internet.email(),
  accesslevel,
  documentId
});

export const invalidShared = {
  noEmail(documentId) {
    return {
      eMaIl: faker.internet.email(),
      documentId
    };
  },
  emptyEmail(documentId) {
    return {
      email: '',
      documentId
    };
  },
  invalidEmail(documentId) {
    return {
      email: faker.name.findName(),
      documentId
    };
  },
  noDocument() {
    return { email: faker.internet.email() };
  },
  nonExistentDocument() {
    return {
      email: faker.internet.email(),
      documentId: uuid()
    };
  },
  invalidDocument() {
    return {
      email: faker.internet.email(),
      documentId: faker.lorem.word()
    };
  },
  invalidAccessLevel(documentId) {
    return {
      email: faker.internet.email(),
      accesslevel: faker.lorem.words(),
      documentId
    };
  }
};

export const getValidComment = (userId, documentId) => ({
  content: faker.lorem.paragraph(),
  userId,
  documentId
});

export const invalidComments = {
  noContent(userId, documentId) {
    return {
      text: faker.lorem.paragraph(),
      userId,
      documentId
    };
  },
  emptyContent(userId, documentId) {
    return {
      content: '',
      userId,
      documentId
    };
  },
  noCommenter(documentId) {
    return {
      content: faker.lorem.paragraph(),
      documentId
    };
  },
  noDocument(userId) {
    return {
      content: faker.lorem.paragraph(),
      userId
    };
  }
};

export const getValidOrg = (privateorg, privatedocs) => ({
  name: faker.company.companyName(),
  privateorg,
  privatedocs
});

export const getValidDomainOrg = (domain, privateorg, privatedocs) => ({
  name: faker.company.companyName(),
  domain: domain || faker.internet.domainName(),
  privateorg,
  privatedocs
});

export const invalidOrgs = {
  noName() {
    return { orgName: faker.company.companyName() };
  },
  emptyName() {
    return { name: '' };
  },
  emptyDomain() {
    return {
      name: faker.company.companyName(),
      domain: '',
    };
  },
  invalidDomain() {
    return {
      name: faker.company.companyName(),
      domain: faker.company.companyName(),
    };
  }
};

export const getValidDep = organisationId => ({
  name: faker.lorem.word(),
  organisationId
});

export const invalidDeps = {
  noName(organisationId) {
    return {
      title: faker.lorem.word(),
      organisationId
    };
  },
  emptyName(organisationId) {
    return {
      name: '',
      organisationId
    };
  },
  noOrganisation() {
    return { name: faker.lorem.word() };
  },
  nonExistentOrganisation() {
    return {
      name: faker.lorem.word(),
      organisationId: uuid()
    };
  },
  invalidOrganisation() {
    return {
      name: faker.lorem.word(),
      organisationId: faker.lorem.word()
    };
  }
};

export const getWord = (string) => {
  const words = string.replace(/[^\s\w-]|_/g, '').split(/\s+/);
  return words[Math.floor(Math.random() * words.length)];
};
