import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseUpdatePasswordData {
  newPassword: string;
  currentPassword: string;
  confirmNewPassword: string;
}

interface UseUpdatePasswordProps {
  onSuccess?: (any?: any) => any;
}

function useUpdatePassword({ onSuccess }: UseUpdatePasswordProps) {
  return useMutation(
    ({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }: UseUpdatePasswordData) =>
      httpClient.post("/user/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    { onSuccess }
  );
}

export default useUpdatePassword;
