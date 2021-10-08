import useResetPassword from "@/hooks/auth/useResetPassword";
import { Alert, Button, FieldStack, InputField, useToasts } from "bumbag";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { ResetPasswordSchema } from "schema";
import validateSchema from "utils/validateSchema";

function ResetPasswordForm() {
  const toasts = useToasts();

  const {
    mutate: resetPassword,
    isSuccess: resetPasswordIsSuccess,
    error: resetPasswordIsError,
    isLoading: resetPasswordIsLoading,
  } = useResetPassword({
    onSuccess: () =>
      toasts.success({
        title: "Password Reset",
        message: "Password changed. You can now login with your new password.",
      }),
  });

  const {
    query: { token },
  } = useRouter();

  return (
    <div>
      {resetPasswordIsSuccess && (
        <Alert title="Password Changed" type="success" marginY="minor-4">
          Your password was changed.
        </Alert>
      )}

      {resetPasswordIsError && (
        <Alert
          title="Unable to Change Password"
          type="danger"
          marginY="minor-4"
        >
          We're unable to reset your password. The token provided might be
          invalid, expired or already used.
        </Alert>
      )}

      <Formik
        initialValues={{ newPassword: "", confirmNewPassword: "" }}
        onSubmit={({ newPassword, confirmNewPassword }) =>
          resetPassword({
            token: token as string,
            confirmNewPassword,
            newPassword,
          })
        }
        validate={(values) => validateSchema(values, ResetPasswordSchema)}
      >
        {(formik) => (
          <>
            <Form>
              <FieldStack>
                <Field
                  component={InputField.Formik}
                  name="newPassword"
                  type="password"
                  label="New Password"
                ></Field>
                <Field
                  component={InputField.Formik}
                  name="confirmNewPassword"
                  type="password"
                  label="Confirm Password"
                ></Field>
              </FieldStack>
              <Button
                palette="dark"
                marginY="minor-4"
                type="submit"
                isLoading={resetPasswordIsLoading}
                disabled={
                  !formik.isValid || !formik.dirty || resetPasswordIsLoading
                }
              >
                Reset Password
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ResetPasswordForm;
