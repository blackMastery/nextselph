import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseResetPasswordData {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UseResetPasswordProps {
  onSuccess?: () => any;
}

function useResetPassword({ onSuccess }: UseResetPasswordProps) {
  return useMutation(
    ["resetPassword"],
    ({ token, newPassword, confirmNewPassword }: UseResetPasswordData) =>
      httpClient.post(`/user/auth/reset-password-confirmation`, {
        token,
        newPassword,
        confirmNewPassword,
      }),
    { onSuccess }
  );
}

export default useResetPassword;
