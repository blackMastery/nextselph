import { useQuery } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseVerifyResetTokenProps {
  token: string;
  enabled?: boolean;
}

function useVerifyResetToken({
  token,
  enabled = true,
}: UseVerifyResetTokenProps) {
  return useQuery(
    ["verifyResetToken"],
    async () => {
      const { data } = await httpClient.get(
        `/user/auth/check-token?type=RESET_PASSWORD&token=${token}`
      );
      return data;
    },
    { enabled }
  );
}

export default useVerifyResetToken;
