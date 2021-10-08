import { User } from "models/user";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

function useUser() {
  const router = useRouter();
  return useQuery<User>("/user/me", {
    onError: ({ status }) => {
      if (status === 401) {
        localStorage.clear();
        router.push("/login");
      }
    },
  });
}

export default useUser;
