import useVerifyResetToken from "@/hooks/auth/useVerifyResetToken";
import {
  Box,
  Card,
  Divider,
  Heading,
  Alert,
  Stack,
  Link as BLink,
} from "bumbag";
import Cell from "@/components/Cell";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function ChangePasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const {
    isSuccess: isSuccessVerifyToken,
    isLoading: isLoadingVerifyToken,
    isError: isErrorVerifyToken,
    data: isTokenValid,
  } = useVerifyResetToken({
    token: token as string,
    enabled: typeof token === "string",
  });

  return (
    <div>
      <Head>
        <title>Password Reset</title>
      </Head>
      <Box display="flex" justifyContent="center" marginTop="100px">
        <Card width="600px">
          <Heading textAlign="center" use="h2" color="primary">
            TrueSelph
          </Heading>
          <Heading textAlign="center" use="h4">
            Reset Password
          </Heading>
          <Cell
            isLoading={isLoadingVerifyToken}
            isSuccess={isSuccessVerifyToken}
            isError={isErrorVerifyToken}
            errorFallback={<p>Unable to verify token.</p>}
          >
            {isTokenValid ? (
              <ResetPasswordForm></ResetPasswordForm>
            ) : (
              <>
                <Alert title="Invalid Token" type="danger">
                  Token provided is invalid, expired or already used.
                </Alert>
              </>
            )}
          </Cell>

          <Divider marginY="minor-4"></Divider>
          <Stack alignX="center">
            <Link href="/login">
              <BLink>Go to Login Page</BLink>
            </Link>
          </Stack>
        </Card>
      </Box>
    </div>
  );
}

export default ChangePasswordPage;
