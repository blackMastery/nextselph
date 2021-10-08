import { InputField } from "bumbag/Input";
import { FieldStack } from "bumbag/FieldStack";
import { Button } from "bumbag/Button";
import { useToasts } from "bumbag/Toast";
import { Alert } from "bumbag/Alert";
import { Formik, Form, Field } from "formik";
import useUser from "../hooks/useUser";
import useUpdatePassword from "@/hooks/user/mutations/useUpdatePassword";
import validateSchema from "utils/validateSchema";
import { UpdatePasswordSchema, CreatePasswordSchema } from "schema";
import useUserHasPassword from "@/hooks/auth/useUserHasPassword";
import Cell from "@/components/Cell";
import { useQueryClient } from "react-query";

function ChangePasswordForm() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const {
    mutate: updatePassword,
    isError: isErrorUpdatePassword,
    isLoading: isLoadingUpdatePassword,
  } = useUpdatePassword({
    onSuccess: () => {
      toasts.success({
        title: "Password Changed!",
        message: "Password changed successfully!",
      });

      queryClient.setQueryData("/user/auth/has-password", true);
    },
  });
  const {
    data: userHasPassword,
    isLoading: isLoadingUserHasPassword,
    isError: isErrorUserHasPassword,
    isSuccess: isSuccessUserHasPassword,
  } = useUserHasPassword();

  const toasts = useToasts();

  return (
    <Cell
      isLoading={isLoadingUserHasPassword}
      errorFallback={<p>Error loading user data.</p>}
      isError={isErrorUserHasPassword}
      isSuccess={isSuccessUserHasPassword}
    >
      <div>
        {isErrorUpdatePassword && (
          <Alert accent="top" type="danger" marginY="minor-5" variant="fill">
            The provided password is incorrect.
          </Alert>
        )}

        {user && (
          <>
            <Formik
              initialValues={{
                newPassword: "",
                currentPassword: "",
                confirmPassword: "",
              }}
              onSubmit={async ({
                newPassword,
                currentPassword,
                confirmPassword,
              }) => {
                updatePassword({
                  currentPassword,
                  newPassword,
                  confirmNewPassword: confirmPassword,
                });
              }}
              validate={(values) =>
                validateSchema(
                  values,
                  !!userHasPassword
                    ? UpdatePasswordSchema
                    : CreatePasswordSchema
                )
              }
            >
              <Form>
                <FieldStack>
                  <Field
                    component={InputField.Formik}
                    name="newPassword"
                    label="New Password"
                    type="password"
                  ></Field>
                  <Field
                    component={InputField.Formik}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                  ></Field>
                  {!!userHasPassword && (
                    <Field
                      component={InputField.Formik}
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      hint="This is needed so we can verify that you're the owner of this account."
                    ></Field>
                  )}

                  <Button
                    type="submit"
                    palette="dark"
                    isLoading={isLoadingUpdatePassword}
                  >
                    Update
                  </Button>
                </FieldStack>
              </Form>
            </Formik>
          </>
        )}
      </div>
    </Cell>
  );
}

export default ChangePasswordForm;
