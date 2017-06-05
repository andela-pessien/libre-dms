export const checkDocumentList = (res) => {
  if (!Array.isArray(res.body)) {
    throw new Error('Expected response body to be an array');
  }
  const document = res.body[Math.floor(Math.random() * res.body.length)];
  if (
  !document.id ||
  !document.title ||
  document.content ||
  !document.type ||
  !document.access ||
  document.accesslevel) {
    throw new Error('Response is not an array of formatted documents');
  }
  if (!res.headers['x-list-metadata']) {
    throw new Error('Expected to receive list metadata');
  }
  const metadata = JSON.parse(
    Buffer
    .from(res.headers['x-list-metadata'], 'base64')
    .toString('utf8'));
  if (
  !metadata.total ||
  !metadata.pages ||
  !metadata.currentPage ||
  !metadata.pageSize
  ) {
    throw new Error('Received incomplete metadata');
  }
};

export const checkUserList = (res) => {
  if (!Array.isArray(res.body)) {
    throw new Error('Expected response body to be an array');
  }
  const user = res.body[Math.floor(Math.random() * res.body.length)];
  if (!(user.id && user.name)) {
    throw new Error('Response is not an array of valid users');
  }
  if (user.password) {
    throw new Error("Should not retrieve people's passwords");
  }
  if (!res.headers['x-list-metadata']) {
    throw new Error('Expected to receive list metadata');
  }
  const metadata = JSON.parse(
    Buffer
    .from(res.headers['x-list-metadata'], 'base64')
    .toString('utf8'));
  if (
  !metadata.total ||
  !metadata.pages ||
  !metadata.currentPage ||
  !metadata.pageSize
  ) {
    throw new Error('Received incomplete metadata');
  }
};
