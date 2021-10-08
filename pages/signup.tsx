import {
  Card,
  Heading,
  Box,
  Button,
  Divider,
  Stack,
  Link as BLink,
  useToasts,
  Alert,
} from "bumbag";
import React from "react";
import Head from "next/head";

import AuthForm from "../components/AuthForm";
import Link from "next/link";
import { SignUpSchema } from "../schema";
import useSignUp from "@/hooks/auth/useSignUp";
import useGoogleAuth from "@/hooks/auth/useGoogleAuth";
import Image from "next/image"


function SignUpPage() {
  const { mutate: signUp, error: signUpError, isLoading: signUpIsLoading } = useSignUp({
    onSuccess: () => {
      toasts.success({
        title: "Account Created!",
        message: "Thank you for creating an account",
      });
    }
  })

  const toasts = useToasts();
  const { signIn } = useGoogleAuth();

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Box display="flex" justifyContent="center" marginTop="100px">
        <Card width="600px">
          <Stack alignX="center" marginY="minor-5">
            <Image src="/logo-dark.png" width="275" height="85"></Image>
          </Stack>
          <Heading textAlign="center" use="h4">
            Sign Up
          </Heading>

          {signUpError && (
            <Alert accent="top" type="danger" marginY="minor-5" variant="fill">
              Another account was created with this email. Please use a different email.
            </Alert>
          )}

          <AuthForm
            submitText="Sign Up"
            onSubmit={async (email, password) =>
              signUp({ email, password })
            }
            schema={SignUpSchema}
            isLoading={signUpIsLoading}
          ></AuthForm>

          <Stack alignX="center">
            <Button
              onClick={() => signIn()}
              disabled={signUpIsLoading}
            >
              Sign Up with Google
            </Button>
          </Stack>
          <Divider marginY="minor-4"></Divider>
          <Stack alignX="center">
            <Link href="/login">
              <BLink>I already have an account</BLink>
            </Link>
          </Stack>
        </Card>
      </Box>
    </>
  );
}

export default SignUpPage;
