import { useMutation, UseMutationOptions } from "react-query";
import { httpClient } from "../../utils/httpClient";

type Credentials = {
  email: string;
  password: string;
};

interface UseSignUpProps {
  onSuccess?: (data) => any;
}

function useSignUp({ onSuccess }: UseSignUpProps) {
  return useMutation(
    (creds: Credentials) => {
      localStorage.clear();
      return httpClient.post("/user/auth/signup", {
        email: creds.email,
        password: creds.password,
        confirmPassword: creds.password,
      });
    },
    { onSuccess }
  );
}

export default useSignUp;
