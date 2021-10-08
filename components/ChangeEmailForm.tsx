import { InputField } from "bumbag/Input";
import { FieldStack } from "bumbag/FieldStack";
import { Button } from "bumbag/Button";
import { useToasts } from "bumbag/Toast";
import { Alert } from "bumbag/Alert";
import { Formik, Form, Field } from "formik";
import useUser from "../hooks/useUser";
import useUpdateEmail from "@/hooks/user/mutations/useUpdateEmail";

function ChangeEmailForm() {
  const { data: user, refetch: refetchUser } = useUser();
  const {
    mutate: updateEmail,
    error,
    isError: isErrorUpdateEmail,
    isLoading: isLoadingUpdateEmail,
  } = useUpdateEmail({
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data?.jwt);
      refetchUser();

      toasts.success({
        title: "Email Updated!",
        message: "Email updated successfully!",
      });
    },
  });
  const toasts = useToasts();

  return (
    <div>
      {isErrorUpdateEmail && (
        <Alert accent="top" type="danger" marginY="minor-5" variant="fill">
          {error?.response?.data?.message ||
            "An error occurred while updating your email."}
        </Alert>
      )}

      {user && (
        <>
          <Formik
            initialValues={{ email: user?.email, currentPassword: "" }}
            onSubmit={async ({ email, currentPassword }) => {
              updateEmail({ newEmail: email, currentPassword });
            }}
          >
            <Form>
              <FieldStack>
                <Field
                  component={InputField.Formik}
                  name="email"
                  label="Email"
                ></Field>
                <Field
                  component={InputField.Formik}
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  hint="This is needed so we can verify that you're the owner of this account."
                ></Field>

                <Button
                  type="submit"
                  palette="dark"
                  isLoading={isLoadingUpdateEmail}
                >
                  Update
                </Button>
              </FieldStack>
            </Form>
          </Formik>
        </>
      )}
    </div>
  );
}

export default ChangeEmailForm;
