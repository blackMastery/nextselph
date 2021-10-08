import useGenerateThumbnail from "@/hooks/useGenerateThumbnail";
import useRecordingContext from "@/hooks/useRecordingContext";
import { recordingStateAtom } from "atoms/recordingStateAtom";
import { showVideoElAtom } from "atoms/showVideElAtom";
import {
  FieldStack,
  FieldWrapper,
  InputField,
  TextareaField,
  Text,
  Box,
  Spinner,
  Alert,
} from "bumbag";
import { Field, useFormikContext } from "formik";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
// import useStore from "store";
import VideoField from "../VideoField";

type ImprintFormProps = {
  publicURL?: string;
  autoStartRecording?: boolean;
  liveTranscriptionStatus?: string;
  liveTranscriptionStage?: string;
  transcript?: string;
  reviewRequired?: boolean;
  hideFields?: boolean;
  leftHint?: string;
  leftHintTitle?: string;
  hideTranscriptField?: boolean;
};

function ImprintForm({
  publicURL,
  hideFields,
  autoStartRecording,
  liveTranscriptionStatus,
  liveTranscriptionStage,
  transcript,
  reviewRequired,
  leftHint,
  leftHintTitle,
  hideTranscriptField,
}: ImprintFormProps) {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const { setFieldValue, values, errors, touched } = useFormikContext<any>();
  const { recordedChunks } = useRecordingContext();
  const { thumbs, generateThumbnails } = useGenerateThumbnail();

  useEffect(() => {
    setFieldValue("transcript", transcript);
  }, [transcript]);

  useEffect(() => {
    setFieldValue("sequence", recordedChunks);
    const blob = new Blob(recordedChunks);
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setVideoURL(URL.createObjectURL(blob));
  }, [recordedChunks]);

  useEffect(() => {
    generateThumbnails({ time: 1, videoURL });
  }, [videoURL]);

  useEffect(() => {
    if (thumbs.length > 0) {
      setFieldValue("thumbnail", thumbs[0]);
    }
  }, [thumbs]);

  return (
    <div>
      <Box
        display="grid"
        gridTemplateColumns={{
          default: "1fr",
          "min-desktop": "1fr 1fr",
        }}
        gridColumnGap="150px"
      >
        <div>
          {leftHint ? <Alert title={leftHintTitle}>{leftHint}</Alert> : <></>}
          {!hideFields ? (
            <FieldStack>
              {values["type"] !== "idle" && (
                <Field
                  component={InputField.Formik}
                  label="Prompt"
                  name="prompt"
                  isRequired
                ></Field>
              )}

              {!hideTranscriptField && (
                <Field
                  disabled={!!(liveTranscriptionStatus === "processing")}
                  component={TextareaField.Formik}
                  label="Transcript"
                  name="transcript"
                  hint={
                    <>
                      {liveTranscriptionStatus !== "processing" &&
                        reviewRequired && (
                          <Alert
                            type="warning"
                            title="Review Transcript"
                            accent="bottom"
                          >
                            Review the transcript above and change it if you are
                            not satified with the output.
                          </Alert>
                        )}
                      {!!(liveTranscriptionStatus === "processing") && (
                        <Alert>
                          <Box display="flex">
                            <Spinner
                              marginRight="minor-2"
                              size="small"
                            ></Spinner>
                            <Box>
                              <Text.Block
                                marginBottom="minor-4"
                                fontWeight="bold"
                              >
                                Processing transcript...
                              </Text.Block>
                              <Text.Block>{liveTranscriptionStage}</Text.Block>
                            </Box>
                          </Box>
                        </Alert>
                      )}
                    </>
                  }
                ></Field>
              )}
            </FieldStack>
          ) : (
            <></>
          )}
        </div>
        <div>
          <div>
            <FieldWrapper
              hint={
                <>
                  <Text color="danger">
                    {touched && errors?.sequence ? errors?.sequence?.[0] : ""}
                  </Text>
                </>
              }
            >
              <Field
                publicURL={publicURL}
                videoURL={videoURL}
                name="sequence"
                autoStartRecording={autoStartRecording}
                component={VideoField}
                value={recordedChunks}
              ></Field>
            </FieldWrapper>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default ImprintForm;
