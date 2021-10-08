import { useRouter } from "next/router";
import { useQuery } from "react-query";

function useConfirmEmail() {
  const router = useRouter();
  const { token } = router.query;
  return useQuery(`/user/auth/email-confirmation?token=${token}`, {
    enabled: typeof token === "string",
    retry: 0,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    cacheTime: 10000000,
    refetchOnWindowFocus: false,
  });
}

export default useConfirmEmail;
