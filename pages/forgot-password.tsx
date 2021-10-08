import useForgotPassword from "@/hooks/auth/useForgotPassword";
import {
  Button,
  Card,
  FieldStack,
  InputField,
  Box,
  Heading,
  useToasts,
  Alert,
  Divider,
  Stack,
  Link as BLink,
} from "bumbag";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { ForgotPasswordSchema } from "../schema";
import validateSchema from "../utils/validateSchema";

function PasswordReset() {
  const toasts = useToasts();
  const {
    mutate: forgotPassword,
    isLoading: isLoadingForgotPassword,
    isSuccess: isSuccessForgotPassword,
  } = useForgotPassword({
    onSuccess: () => {
      toasts.success({
        title: "Forgot Password",
        message: "Check your email for a link to reset your password.",
      });
    },
  });

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <Box display="flex" justifyContent="center" marginTop="100px">
        <Card width="600px">
          <Heading textAlign="center" use="h2" color="primary">
            TrueSelph
          </Heading>
          <Heading textAlign="center" use="h4">
            Forgot Password
          </Heading>

          {isSuccessForgotPassword && (
            <>
              <Alert title="Password Reset" type="success" marginY="minor-5">
                An email was sent with instructions on how to reset your
                password. If the email provided was correct your should received
                the email shortly.
              </Alert>
            </>
          )}

          <Formik
            initialValues={{ email: "" }}
            onSubmit={({ email }) => {
              forgotPassword({ email });
            }}
            validate={(values) => validateSchema(values, ForgotPasswordSchema)}
          >
            {(formik) => (
              <>
                <Form>
                  <FieldStack>
                    <Field
                      component={InputField.Formik}
                      name="email"
                      label="Email"
                    ></Field>
                  </FieldStack>
                  <Button
                    palette="dark"
                    marginY="minor-4"
                    type="submit"
                    isLoading={isLoadingForgotPassword}
                    disabled={
                      !formik.isValid ||
                      !formik.dirty ||
                      isLoadingForgotPassword
                    }
                  >
                    Reset Password
                  </Button>
                </Form>
              </>
            )}
          </Formik>
          <Divider marginY="minor-4"></Divider>
          <Stack alignX="center">
            <Link href="/login">
              <BLink>Go to Login Page</BLink>
            </Link>
          </Stack>
        </Card>
      </Box>
    </>
  );
}

export default PasswordReset;
