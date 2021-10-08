import { Card } from "bumbag/Card";
import { Tabs } from "bumbag/Tabs";
import { Heading } from "bumbag/Heading";
import { Stack } from "bumbag/Stack";
import React from "react";
import ChangeEmailForm from "../../components/ChangeEmailForm";
import DashboardLayout from "../../layouts/dashboard-layout";
import ChangePasswordForm from "components/ChangePasswordForm";
import { Divider } from "bumbag";

function ManageAccountPage() {
  return (
    <div>
      <DashboardLayout
        label="Manage Account"
        title="Manage Account"
        path={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Manage Account", href: "/dashboard/manage-account" },
        ]}
      >
        <Card>
          <Stack>
            <Heading use="h3">Change Email</Heading>
            <ChangeEmailForm></ChangeEmailForm>
            <Divider></Divider>
            <Heading use="h3">Change Password</Heading>
            <ChangePasswordForm></ChangePasswordForm>
          </Stack>
        </Card>
      </DashboardLayout>
    </div>
  );
}

export default ManageAccountPage;
