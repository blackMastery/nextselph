import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseUpdateEmailData {
  newEmail: string;
  currentPassword: string;
}

interface UseUpdateEmailProps {
  onSuccess?: (any?: any) => any;
  onError?: (any?: any) => any;
}

function useUpdateEmail({ onSuccess, onError }: UseUpdateEmailProps) {
  return useMutation(
    ({ currentPassword, newEmail }: UseUpdateEmailData) =>
      httpClient.post("/user/auth/change-email", {
        currentPassword,
        newEmail,
      }),
    { onSuccess, onError }
  );
}

export default useUpdateEmail;
