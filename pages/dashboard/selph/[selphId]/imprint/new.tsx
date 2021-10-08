import * as z from "zod";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Text,
  Card,
  Stack,
  Divider,
  Link as BLink,
  useToasts,
} from "bumbag";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import ImprintForm from "@/components/Imprint/ImprintForm";
import { Form, Formik, FormikBag } from "formik";
import { ChunksContext } from "pages/dashboard/new-selph";
import useCreateImprint from "@/hooks/imprints/mutations/useCreateImprint";
import { useQueryClient } from "react-query";
import validateSchema from "utils/validateSchema";
import { ImprintSchema } from "schema";
import useImprints from "@/hooks/imprints/queries/useImprints";
import Cell from "@/components/Cell";
import Pusher from "pusher-js";
import useEditImprint from "@/hooks/imprints/mutations/useEditImprint";
import useImprint from "@/hooks/imprints/queries/useImprint";
import useRooms from "@/hooks/useRooms";
import usePublishImprint from "@/hooks/imprints/mutations/usePublishImprint";

const baseImprintTypes = ["IDLE", "CONFUSED", "GREETING", "GOODBYE"];

const pusher = new Pusher("44cfcedc3cd5ef7ee6a8", {
  cluster: "us2",
});

function NewImprintPage() {
  const [liveTranscriptionStatus, setLiveTranscriptionStatus] = useState("");
  const [liveTranscriptionStage, setLiveTranscriptionStage] = useState("");
  const [reviewRequired, setReviewRequired] = useState(false);
  const [missingBaseTypes, setMissingBaseTypes] = useState([]);
  const router = useRouter();
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { selphId } = router.query;
  const queryClient = useQueryClient();
  const toasts = useToasts();

  const {
    data: imprint,
    mutate: createImprint,
    isLoading,
    isSuccess: isCreateImprintSuccess,
  } = useCreateImprint({
    onSuccess: (imprint) => {
      if (baseImprintTypes.includes(imprint?.type)) {
        setMissingBaseTypes((prevMissingBaseTypes) => {
          const newMissingBaseTypes = prevMissingBaseTypes.filter(
            (type) => type !== imprint?.type
          );
          if (newMissingBaseTypes.length === 0) {
            router.push({
              pathname: "/dashboard/selph/[selphId]/",
              query: { selphId },
            });
          }
          return newMissingBaseTypes;
        });
      }
      toasts.success({
        title: "Imprint added.",
        message: "Imprint added to selph.",
      });
      queryClient.invalidateQueries(["imprints", { selphId: Number(selphId) }]);
    },
  });

  const { publishImprint } = usePublishImprint({});

  const { mutate: editImprint, isLoading: isEditImprintLoading } =
    useEditImprint({
      onSuccess: () => {
        setReviewRequired(false);
      },
    });

  const { data: newImprint, refetch: refetchNewImprint } = useImprint({
    imprintId: imprint?.id,
    enabled: !!imprint?.id,
  });

  const {
    data: imprints,
    isLoading: isLoadingImprints,
    isError: isErrorImprints,
    isSuccess: isSuccessImprints,
  } = useImprints({
    selphId: parseInt(selphId as string),
    enabled: parseInt(selphId as string) !== NaN,
    onSuccess: (imprintsRes) => {
      for (let type of baseImprintTypes) {
        const baseImprints = imprintsRes.filter((imp) => imp.type === type);
        if (!baseImprints.length) {
          setMissingBaseTypes((missingBaseTypes) => [
            ...missingBaseTypes.filter((baseType) => baseType !== type),
            type,
          ]);
        }
      }
    },
  });

  const onSubmit = async (
    { prompt, transcript },
    { resetForm, setFieldValue }: FormikBag<any, any>
  ) => {
    if (reviewRequired) {
      editImprint({
        id: imprint?.id,
        transcript,
        prompt,
      });

      publishImprint({ id: imprint?.id, published: true });

      resetForm();
      setRecordedChunks([]);
      setReviewRequired(false);
      setLiveTranscriptionStatus("");
      setLiveTranscriptionStage("");
    } else {
      setLiveTranscriptionStatus("processing");
      const blobId = uuidv4();
      console.log({ recordedChunks });
      await localforage
        .setItem(`imprint_${blobId}`, recordedChunks[0])
        .then((data) => console.log("stored ", data));

      createImprint({
        prompt: !!missingBaseTypes.length
          ? baseTypePrompt[missingBaseTypes[0]]
          : prompt,
        type: !!missingBaseTypes.length ? missingBaseTypes[0] : "interaction",
        transcript,
        blobId,
        selph: Number(selphId),
      });

      if (missingBaseTypes.length) {
        setRecordedChunks([]);
      }
    }
  };

  const baseTypeTitle = {
    IDLE: "Add Idle Imprint",
    CONFUSED: "Add Confused Imprint",
    GREETING: "Add Greeting Imprint",
    GOODBYE: "Add Goodbye Imprint",
  };

  const baseTypePrompt = {
    IDLE: "Your Idle Imprint",
    CONFUSED: "Your Confused Imprint",
    GREETING: "Your Hello Imprint",
    GOODBYE: "Your Goodbye Imprint",
  };

  const baseTypeMessage = {
    IDLE: "Every selph requires an idle imprint. Record or upload a video of you looking at the camera.",
    CONFUSED: `All selphs also require a confused imprint. When we can't find an appropriate 
            response to a question the recorded or uploaded response will be sent.`,
    GREETING:
      "Record or upload a video of you saying, 'Hi' or 'Hello', or something similar.",
    GOODBYE:
      "Record or upload a video of you saying, 'Goodbye' or 'See you later', or something similar.",
  };

  const { joinRoom, socket } = useRooms();

  useEffect(() => {
    if (socket && imprint) {
      joinRoom(`imprint-${imprint.id}`, (data: any) => {
        setLiveTranscriptionStatus(data?.value);
        !!data?.stage && setLiveTranscriptionStage(data?.stage);

        if (data?.value === "failed") {
          // channel.unbind("transcription_status");
        }

        if (data?.value === "success" && !missingBaseTypes.length) {
          setReviewRequired(true);
          refetchNewImprint();
        }
      });
    }
  }, [socket, imprint]);

  return (
    <div>
      <DashboardLayout
        label="New Imprint"
        title="New Imprint"
        backButton={{ label: "Back", href: `/dashboard/selph/${selphId}` }}
        path={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Selph Details", href: `/dashboard/selph/${selphId}` },
          { name: "New Imprint", href: "#" },
        ]}
      >
        <Card>
          <Cell
            errorFallback={<p>An error occured. Please try again later.</p>}
            isError={isErrorImprints}
            isLoading={isLoadingImprints}
            isSuccess={isSuccessImprints}
          >
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
            {missingBaseTypes.length ? (
              <>
                <Text.Block
                  textAlign="center"
                  fontSize="300"
                  textTransform="uppercase"
                  use="strong"
                >
                  {baseTypePrompt[missingBaseTypes[0]]}
                </Text.Block>
                <Divider marginY="minor-8" />
              </>
            ) : (
              <></>
            )}
            <Formik
              initialValues={{
                prompt: "",
                transcript: "",
                type: "interaction",
              }}
              onSubmit={onSubmit}
              validate={(values) =>
                validateSchema(
                  values,
                  missingBaseTypes.length
                    ? ImprintSchema.extend({ prompt: z.string().optional() })
                    : ImprintSchema
                )
              }
            >
              {(formik) => (
                <Form>
                  <Stack>
                    <ChunksContext.Provider
                      value={{
                        recordedChunks,
                        setRecordedChunks,
                      }}
                    >
                      <ImprintForm
                        hideTranscriptField={
                          !["processing", "success"].includes(
                            liveTranscriptionStatus
                          )
                        }
                        liveTranscriptionStatus={
                          missingBaseTypes.length
                            ? undefined
                            : liveTranscriptionStatus
                        }
                        liveTranscriptionStage={
                          missingBaseTypes.length
                            ? undefined
                            : liveTranscriptionStage
                        }
                        transcript={
                          missingBaseTypes.length
                            ? undefined
                            : newImprint?.transcript
                        }
                        reviewRequired={reviewRequired}
                        leftHintTitle={baseTypeTitle[missingBaseTypes[0]]}
                        leftHint={baseTypeMessage[missingBaseTypes[0]]}
                        hideFields={!!missingBaseTypes.length}
                        autoStartRecording
                      ></ImprintForm>
                    </ChunksContext.Provider>
                    <Button
                      type="submit"
                      palette="dark"
                      isLoading={
                        isLoading || formik.isSubmitting || isEditImprintLoading
                      }
                      disabled={
                        !formik.isValid ||
                        (!missingBaseTypes.length &&
                          liveTranscriptionStatus === "processing")
                      }
                    >
                      {reviewRequired ? "Review & Create Another" : "Create"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Cell>
        </Card>
      </DashboardLayout>
    </div>
  );
}

export default NewImprintPage;
