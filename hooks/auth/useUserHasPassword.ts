import { useQuery } from "react-query";

const useUserHasPassword = () => {
  return useQuery<boolean>("/user/auth/has-password");
};

export default useUserHasPassword;
