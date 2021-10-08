import useConfirmEmail from "@/hooks/auth/useConfirmEmail";
import { Card, PageContent, Alert, Button, Spinner } from "bumbag";
import Cell from "@/components/Cell";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

function VerifyEmailPage() {
  const router = useRouter();
  const {
    isSuccess: confirmEmailIsSuccess,
    isError: confirmEmailIsError,
    isLoading: confirmEmailIsLoading,
  } = useConfirmEmail();

  return (
    <>
      <Head>
        <title>Email Verification</title>
      </Head>

      <PageContent>
        <Card title="Email Verification">
          <Cell
            isError={confirmEmailIsError}
            isLoading={confirmEmailIsLoading}
            isSuccess={confirmEmailIsSuccess}
            errorFallback={
              <>
                <Alert title="Invalid Token" type="danger">
                  Unable to verify email. The token provided is invalid.
                </Alert>
              </>
            }
          >
            <Alert title="Email confirmed." type="success">
              Email verified.
            </Alert>
          </Cell>
        </Card>

        <Button
          marginY="minor-5"
          palette="dark"
          onClick={() => router.push("/login")}
        >
          Go Back to Login
        </Button>
      </PageContent>
    </>
  );
}

export default VerifyEmailPage;
