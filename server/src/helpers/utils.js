// Auth check user
export function authCheck(auth) {
  return auth && auth.user && auth.user.id;
}
