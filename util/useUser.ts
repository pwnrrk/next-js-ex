function logout() {
  localStorage.clear();
}

export default async function useUser() {
  const userData = {
    user: null,
    isLoggedin: false,
    logout,
  };
  const response = await fetch("/api/user", {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  if (data) {
    userData.user = data;
    userData.isLoggedin = true;
  }
  return userData;
}
