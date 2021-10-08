import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button, Card, Stack, Link as BLink, useToasts, Switch } from "bumbag";
import { useRouter } from "next/router";
import ImprintForm from "@/components/Imprint/ImprintForm";
import { Form, Formik } from "formik";
import useEditImprint from "@/hooks/imprints/mutations/useEditImprint";
import { useQueryClient } from "react-query";
import { ChunksContext } from "pages/dashboard/new-selph";
import useImprint from "@/hooks/imprints/queries/useImprint";
import Cell from "@/components/Cell";
import usePublishImprint from "@/hooks/imprints/mutations/usePublishImprint";
import { io, Socket } from "socket.io-client";
import useRooms from "@/hooks/useRooms";

function EditImprintPage() {
  const [liveTranscriptionStatus, setLiveTranscriptionStatus] = useState("");
  const [liveTranscriptionStage, setLiveTranscriptionStage] = useState("");
  const router = useRouter();
  const { selphId, imprintId } = router.query;

  const toasts = useToasts();
  const queryClient = useQueryClient();

  const [recordedChunks, setRecordedChunks] = useState([]);
  const {
    data: imprint,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useImprint({
    imprintId: Number(imprintId as string),
  });

  const { joinRoom, socket } = useRooms();

  useEffect(() => {
    if (socket && imprintId) {
      joinRoom(`imprint-${imprintId}`, (data) => {
        console.log(data);
        if (data?.value) {
          setLiveTranscriptionStatus(data.value);
        }

        if (data?.stage) {
          setLiveTranscriptionStage(data.stage);
        }

        if (data?.value === "failed") {
          // setLiveTranscriptionStatus("");
          // setLiveTranscriptionStage("");
        }

        if (data?.value === "success") {
          refetch();
          setRecordedChunks([]);
        }
      });

      return () => socket.disconnect();
    }
  }, [socket, imprintId]);

  const { mutate: editImprint, isLoading: editImprintIsLoading } =
    useEditImprint({
      onSuccess: ({ data }) => {
        if (data?.reviewed && !imprint.reviewed) {
          router.push({
            pathname: "/dashboard/selph/[selphId]",
            query: { selphId },
          });
        }
        toasts.success({
          title: "Imprint Updated",
          message: "Imprint updated successfully!",
        });
        queryClient.invalidateQueries("/imprints/" + imprintId);
      },
    });

  const { publishImprint } = usePublishImprint({
    onSuccess: () => {
      toasts.success({
        title: "Imprint Updated",
        message: "Imprint updated successfully!",
      });
      queryClient.invalidateQueries("/imprints/" + imprintId);
    },
  });

  const onPublishedChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    publishImprint({
      id: Number(imprint?.id),
      published: e.target?.checked,
    });
  };

  return (
    <div>
      <DashboardLayout
        label="Edit Imprint"
        title="Edit Imprint"
        backButton={{ label: "Back", href: `/dashboard/selph/${selphId}` }}
        path={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Selph Details", href: `/dashboard/selph/${selphId}` },
          { name: "Edit Imprint", href: "#" },
        ]}
      >
        {selphId && imprintId && (
          <Card>
            {!isLoading && !isError && (
              <Switch
                palette="dark"
                label="Published"
                checked={imprint?.published}
                onChange={onPublishedChanged}
              ></Switch>
            )}
            <Stack alignX="right">
              <BLink
                onClick={() =>
                  router.push({
                    pathname: "/dashboard/selph/[selphId]",
                    query: { selphId },
                  })
                }
              >
                View Selph
              </BLink>
            </Stack>
            <Cell
              isLoading={isLoading}
              isError={isError}
              isSuccess={isSuccess}
              errorFallback={<p>An error occured while fetching imprint.</p>}
            >
              <ChunksContext.Provider
                value={{ recordedChunks, setRecordedChunks }}
              >
                <Formik
                  initialValues={{
                    type: imprint?.type,
                    prompt: imprint?.prompt,
                    transcript: imprint?.transcript,
                  }}
                  onSubmit={async ({ type, prompt, transcript }) => {
                    editImprint({
                      id: Number(imprintId),
                      type,
                      prompt,
                      transcript,
                      recordedChunks: recordedChunks.length
                        ? recordedChunks
                        : undefined,
                      reviewed:
                        !imprint.reviewed && !recordedChunks.length
                          ? true
                          : undefined,
                      published: !imprint.reviewed ? true : undefined,
                    });
                  }}
                >
                  {(formik) => (
                    <Form>
                      <Stack>
                        <ImprintForm
                          liveTranscriptionStatus={liveTranscriptionStatus}
                          liveTranscriptionStage={liveTranscriptionStage}
                          transcript={imprint?.transcript}
                          reviewRequired={
                            !imprint.reviewed && !recordedChunks.length
                          }
                          publicURL={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            "/file/" +
                            imprint?.sequence
                          }
                        ></ImprintForm>
                        <Button
                          type="submit"
                          palette="dark"
                          isLoading={editImprintIsLoading}
                          disabled={
                            !formik.dirty ||
                            !formik.isValid ||
                            !!(liveTranscriptionStatus === "processing")
                          }
                        >
                          {recordedChunks.length
                            ? "Update"
                            : !imprint.reviewed
                            ? "Review and Update"
                            : "Update"}
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </ChunksContext.Provider>
            </Cell>
          </Card>
        )}
      </DashboardLayout>
    </div>
  );
}

export default EditImprintPage;
