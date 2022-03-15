import type { UserModel } from "models/user";
import useSWR from "swr";

type UserStore = {
  isLoading: boolean;
  isError?: any;
  user?: UserModel;
};

export default function useUser(token?: string): UserStore {
  const fetcher = (path: string) =>
    fetch(path, {
      method: "GET",
      headers: {
        authorization: `Bearer ${
          token || localStorage.getItem("access_token")
        }`,
      },
    });
  const { data, error } = useSWR("/api/user", fetcher);
  return {
    user: data,
    isError: error,
    isLoading: !data && !error,
  };
}
