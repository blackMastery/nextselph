import { Alert, Button, Box, Dialog, ActionButtons } from "bumbag";
import React from "react";

function ConfirmEmail() {
  return (
    <div>
      <Dialog title="Email not verified!" type="warning" standalone>
        <Dialog.Content>
          <Dialog.Icon />
          <Box>
            <Dialog.Header>
              <Dialog.Title>Please verify your email.</Dialog.Title>
            </Dialog.Header>
            One final step is required to complete your registration and to begin
            using {process.env.NEXT_PUBLIC_SITE_NAME}. Please check your inbox
            for a verification email.
          </Box>
        </Dialog.Content>
        <Dialog.Footer justifyContent="flex-end">
          <ActionButtons
            submitText="Resend Verification Email"
            cancelText="Change Email"
          />
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}

export default ConfirmEmail;
