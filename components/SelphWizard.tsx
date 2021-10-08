import { RecordingState } from "@/hooks/useRecordVideo";
import useUser from "@/hooks/useUser";
import { useMachine } from "@xstate/react";
import { showVideoElAtom } from "atoms/showVideElAtom";
import {
  Alert,
  Divider,
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Spinner,
  Level,
} from "bumbag";
import { Form, Formik } from "formik";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { ChunksContext } from "pages/dashboard/new-selph";
import React, { useEffect, useState } from "react";
import { SelphSchema } from "schema";
import validateSchema from "utils/validateSchema";
import { selphWizardMachine } from "./selph-wizard.machine";
import SelphForm from "./selph/SelphForm";
import VideoField from "./VideoField";
import VideoPreview from "./VideoPreview";

function NewImprintWizard() {
  const [state, send] = useMachine(selphWizardMachine);
  const [_, refresh] = useState({});
  const { data: user } = useUser();
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [topic, setTopic] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoEl] = useAtom(showVideoElAtom);
  const router = useRouter();

  useEffect(() => {
    const topic: any = state.context.topics.find(
      (topic: any) =>
        topic.id === state.context.history[state.context.history.length - 1]
    );
    setTopic(topic);
  }, [state.context.history]);
  useEffect(() => {
    if (state.value === "finish") {
      router.push("/dashboard/selph/" + state.context.selph?.id);
    }

    if (state.value === "active" && state.context.history?.length === 0) {
      send("NEXT", { topicId: "idle" });
    }
  }, [state.value]);
  useEffect(() => {
    if (topic) {
      setVideoURL(null);
      // set recorded chunks for current topic
      send("SET_CHUNKS", { chunks: recordedChunks, topicId: topic?.id });
    }
  }, [recordedChunks]);

  useEffect(() => {
    console.log({ imprints: state.context.imprints });

    refresh({});
  }, [state.context.imprints]);
  useEffect(() => {
    setVideoURL(state.context.imprints[topic?.id]?.previewURL);
  }, [state.context.imprints[topic?.id]?.previewURL]);

  return (
    <div>
      <Heading use="h4">Add Imprints</Heading>

      {!!state.context.createdImprints[topic?.id] && (
        <>
          <Alert
            variant="fill"
            title="Imprint Created"
            marginTop="minor-5"
            type="success"
            marginBottom="minor-5"
          >
            Your imprint was added to the Selph. You can continue to make
            changes and when you're done we'll automatically update the imprint
            when you hit "Next".
          </Alert>
        </>
      )}
      <Text.Block
        textAlign="center"
        fontSize="300"
        textTransform="uppercase"
        use="strong"
        marginY={{ mobile: "minor-8" }}
      >
        {topic?.prompt}
      </Text.Block>
      <Divider marginY="minor-8" />
      <Box
        display="grid"
        gridTemplateColumns={{ default: "1fr 1fr", mobile: "1fr" }}
        gridColumnGap="12px"
      >
        <div>
          {state.value === "active" ||
          state.value === "createSelph" ||
          state.value === "createImprint" ? (
            <Alert title="Hint" marginBottom={{ mobile: "minor-4" }}>
              {topic?.helpText
                ? topic?.helpText
                : "Record a video then click 'Next'."}
            </Alert>
          ) : (
            <Alert title="Hint" marginBottom={{ mobile: "minor-4" }}>
              Complete the form to begin.
            </Alert>
          )}
        </div>

        <div>
          <Formik
            onSubmit={({ name, description }) => {
              send("SET_SELPH", {
                selph: {
                  name,
                  description,
                  userId: user?.id as number,
                },
              });
            }}
            initialValues={{
              name: "",
              description: "",
            }}
            validate={(values) => validateSchema(values, SelphSchema)}
          >
            {({ isValid }) => {
              return (
                <Form>
                  {state.value === "define" && (
                    <>
                      <SelphForm />
                      <Button
                        type="submit"
                        palette="dark"
                        marginY="minor-4"
                        disabled={!isValid}
                      >
                        Continue
                      </Button>
                    </>
                  )}
                  {(state.value === "active" ||
                    state.value === "createSelph" ||
                    state.value === "createImprint" ||
                    state.value === "createLastImprint") && (
                    <>
                      {topic?.labels && (
                        <>
                          <br />
                          <Stack orientation="horizontal">
                            {Object.keys(topic.labels).map((key) => (
                              <Button
                                key={key}
                                onClick={() =>
                                  send("NEXT", { topicId: Number(key) })
                                }
                              >
                                {topic.labels[key]}
                              </Button>
                            ))}
                          </Stack>
                        </>
                      )}

                      {!!topic?.type && !(topic?.next.length > 1) && (
                        <>
                          <ChunksContext.Provider
                            value={{
                              recordedChunks,
                              setRecordedChunks,
                            }}
                          >
                            {state.value === "createImprint" ? (
                              <Spinner></Spinner>
                            ) : (
                              <VideoField
                                autoStartRecording
                                videoURL={videoURL ? videoURL : ""}
                                onRecordingChange={(recordingState) => {
                                  if (
                                    recordingState === RecordingState.RECORDING
                                  ) {
                                    setIsRecording(true);
                                  } else {
                                    setIsRecording(false);
                                  }
                                }}
                              />
                            )}
                          </ChunksContext.Provider>
                        </>
                      )}
                      {!topic && state.value === "createSelph" && (
                        <Spinner></Spinner>
                      )}
                    </>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </Box>
      {(state.value === "active" ||
        state.value === "createSelph" ||
        state.value === "createImprint" ||
        state.value === "createLastImprint") && (
        <Level marginY="minor-2">
          {topic && (
            <Button palette="dark" onClick={() => send("PREV")}>
              Back
            </Button>
          )}

          {!topic?.required && !!topic?.type && !!topic?.next && (
            <Button
              onClick={() => {
                send("NEXT", { topicId: topic?.next?.[0]?.id });
                setRecordedChunks([]);
              }}
            >
              Skip
            </Button>
          )}
          {topic?.next?.length === 0 && (
            <Button
              // @ts-ignore
              isLoading={state.value === "createLastImprint"}
              disabled={!state.context.imprints?.[topic?.id]?.previewURL}
              onClick={() => send("FINISH")}
            >
              Finish
            </Button>
          )}
          {topic?.next?.length > 0 && !topic?.labels && !!topic?.next && (
            <Button
              isLoading={
                !!(
                  state.value === "createImprint" ||
                  state.value === "createSelph" ||
                  // @ts-ignore
                  state.value === "updateImprint"
                )
              }
              disabled={!state.context.imprints?.[topic?.id]?.previewURL}
              palette="dark"
              onClick={() => {
                send("NEXT", { topicId: topic?.next?.[0]?.id });
                setRecordedChunks([]);
              }}
            >
              Next
            </Button>
          )}
        </Level>
      )}
    </div>
  );
}

export default NewImprintWizard;
