import { Box, Button, FieldStack, InputField, Link as BLink } from "bumbag";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import React from "react";
import { ZodType } from "zod";
import validateSchema from "../utils/validateSchema";

type AuthFormProps = {
  isLoading?: boolean;
  submitText: string;
  schema: ZodType<any, any>;
  onSubmit: (email: string, password: string) => any;
};

function AuthForm({ onSubmit, isLoading, submitText, schema }: AuthFormProps) {
  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={({ email, password }) => onSubmit(email, password)}
        validate={(values) => validateSchema(values, schema)}
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
                <Field
                  component={InputField.Formik}
                  label="Password"
                  name="password"
                  type="password"
                ></Field>
              </FieldStack>
              <FieldStack>

              <Box paddingTop='15px' width="100%" display="flex" flexDirection="column" justifyContent="space-between" >
                <div>
                  <Button
                    width="100%"
                    // palette="dark"
                    backgroundColor='#1f3f98'
                    color='#ffffff'
                    // marginY="minor-4"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    {submitText}
                  </Button>
                </div>

                <div>
                  {submitText.toLocaleLowerCase() === "login" && (
                    <Link href="/forgot-password">
                      <BLink>Forgot your password?</BLink>
                    </Link>
                  )}
                </div>
              </Box>
              </FieldStack>

            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AuthForm;
