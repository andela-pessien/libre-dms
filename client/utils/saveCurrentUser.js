export default function saveCurrentUser(user) {
  window.localStorage.setItem('libredms-user', JSON.stringify(user));
}
