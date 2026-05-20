import { auth as dataAuth } from "../lib/data";

export const auth = {
  get: dataAuth.getUser,
  getToken: dataAuth.getToken,
  set: (user) => localStorage.setItem("session", JSON.stringify(user)),
  logout: dataAuth.logout,
};
