export function saveCurrentUser(user) {
  window.localStorage.setItem('libredms-user', JSON.stringify(user));
}

export function getCurrentUserId() {
  try {
    return JSON.parse(window.localStorage.getItem('libredms-user')).id;
  } catch (err) {
    return null;
  }
}
