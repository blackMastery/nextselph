import { Box, Card, Heading } from "bumbag";
import React from "react";
import Head from "next/head";
import DashboardLayout from "../../layouts/dashboard-layout";
import SelphWizard from "@/components/SelphWizard";

export const ChunksContext = React.createContext<{
  recordedChunks?: any[];
  setRecordedChunks?: (arg0: any) => any;
}>({});

function NewSelphPage() {
  return (
    <>
      <Head>
        <title>New Selph | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>
      <DashboardLayout
        label="New Selph"
        title="New Selph"
        path={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "New Selph", href: "#" },
        ]}
      >
        <Card>
          <Box
            marginBottom="minor-8"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading use="h3">Create a Selph</Heading>
          </Box>
          <SelphWizard />
        </Card>
      </DashboardLayout>
    </>
  );
}

export default NewSelphPage;
