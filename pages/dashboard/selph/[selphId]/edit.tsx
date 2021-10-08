import useSelph from "@/hooks/selph/queries/useSelph";
import { Button, Card, Stack, useToasts } from "bumbag";
import Cell from "@/components/Cell";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import SelphForm from "@/components/selph/SelphForm";
import useEditSelph from "@/hooks/selph/mutations/useEditSelph";
import DashboardLayout from "@/layouts/dashboard-layout";
import { SelphSchema } from "../../../../schema";
import validateSchema from "../../../../utils/validateSchema";

const EditSelphForm = ({ selphId }) => {
  const {
    data: selph,
    isLoading: selphIsLoading,
    isSuccess: selphIsSuccess,
    isError: selphIsError,
    refetch: refetchSelph,
  } = useSelph({ selphId });

  const { mutate: editSelph, isLoading: editSelphIsLoading } = useEditSelph({
    onSuccess: () => {
      toasts.success({
        title: "Selph updated!",
        message: "Selph updated successfully.",
      });
      refetchSelph();
    },
  });

  const toasts = useToasts();

  return (
    <div>
      <Cell
        isLoading={selphIsLoading}
        isSuccess={selphIsSuccess}
        isError={selphIsError}
        errorFallback={<p>Error fetching selph.</p>}
      >
        {selph && (
          <Formik
            onSubmit={(data) => editSelph({ ...data, selphId })}
            initialValues={{
              name: selph.name,
              description: selph.description,
            }}
            validate={(values) => validateSchema(values, SelphSchema)}
          >
            {(formik) => (
              <>
                <Form>
                  <Stack>
                    <SelphForm></SelphForm>
                    <Button
                      type="submit"
                      palette="dark"
                      isLoading={editSelphIsLoading}
                      disabled={!formik.dirty || !formik.isValid}
                    >
                      Update
                    </Button>
                  </Stack>
                </Form>
              </>
            )}
          </Formik>
        )}
      </Cell>
    </div>
  );
};

function EditSelphPage() {
  const {
    query: { selphId },
  } = useRouter();

  return (
    <DashboardLayout
      label="Edit Selph"
      title="Edit Selph"
      backButton={{ label: "Back", href: `/dashboard/selph/${selphId}` }}
      path={[
        { name: "Dashboard", href: "/dashboard" },
        { name: "Selph Details", href: `/dashboard/selph/${selphId}` },
        { name: "Edit Selph", href: "#" },
      ]}
    >
      <Card>
        {selphId && <EditSelphForm selphId={selphId}></EditSelphForm>}
      </Card>
    </DashboardLayout>
  );
}

export default EditSelphPage;
