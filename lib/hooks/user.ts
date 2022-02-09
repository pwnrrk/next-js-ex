import type { User } from "../../models/user";

type UserStore = {
  isLoggedin: boolean;
  user?: User;
};

export async function userStore() {
  const userStore: UserStore = {
    isLoggedin: false,
    user: undefined,
  };
  if (localStorage.getItem("token")) {
    const res = await fetch("/api/user", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (data) {
      userStore.user = data;
      userStore.isLoggedin = true;
    }
  }
  return userStore;
}
