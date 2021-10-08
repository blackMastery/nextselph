import { useQuery } from "react-query";
import { httpClient } from "utils/httpClient";
import { useGoogleLogin } from "react-google-login";
import { useState } from "react";
import { useRouter } from "next/router";

function useGoogleAuth() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<null | string>(null);

  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    onSuccess: (data: any) => {
      console.log(data);
      setAccessToken(data.accessToken);
    },
    onFailure: (err) => console.log(err),
  });

  useQuery(
    "googleAuth",
    () => {
      localStorage.clear();
      return httpClient.get(
        `/user/auth/google/callback?access_token=${accessToken}`
      );
    },
    {
      enabled: !!accessToken,
      onSuccess: ({ data }) => {
        localStorage.setItem("token", data?.jwt);
        router.push("/dashboard");
      },
    }
  );

  return { signIn };
}

export default useGoogleAuth;
