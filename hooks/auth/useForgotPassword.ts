import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseForgotPasswordData {
  email: string;
}

interface UseForgotPasswordProps {
  onSuccess?: (data: any) => any;
}

function useForgotPassword({ onSuccess }: UseForgotPasswordProps) {
  return useMutation(
    ({ email }: UseForgotPasswordData) =>
      httpClient.post("/user/auth/forgot-password", { email }),
    { onSuccess }
  );
}

export default useForgotPassword;
