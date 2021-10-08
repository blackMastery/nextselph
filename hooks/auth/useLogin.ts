import { useState } from "react";
import { useMutation, UseMutationOptions } from "react-query";
import { httpClient } from "../../utils/httpClient";

type Credentials = {
  email: string;
  password: string;
};

interface UseLoginProps {
  onSuccess?: (data: any) => any;
  onError?: (data: any) => any;
}

function useLogin({ onSuccess }: UseLoginProps) {
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const mutation = useMutation(
    (creds: Credentials) => {
      setIsEmailConfirmed(true);
      localStorage.clear();
      return httpClient
        .post("/user/auth/login/", {
          email: creds.email,
          password: creds.password,
        })
        .catch((err) => {
          if (err.response?.data?.message === "Email not confirmed.")
            setIsEmailConfirmed(false);
          throw err;
        });
    },
    {
      onSuccess,
    }
  );
  return { ...mutation, isEmailConfirmed };
}

export default useLogin;
