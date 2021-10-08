import {
  Box,
  Key,
  Text,
  Button,
  Alert,
  Stack,
  Clickable,
  Icon,
  Tooltip,
  OptionButtons,
} from "bumbag";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { v4 as uuidv4 } from "uuid";
import useRecordVideo, { RecordingState } from "@/hooks/useRecordVideo";
import VideoUploadButton from "./VideoUploadButton";
import { faCircle, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import RecordOptionsModal from "./RecordOptionsModal";
import Image from "next/image";
import useRecordingContext from "@/hooks/useRecordingContext";
import VideoPreview from "./VideoPreview";

dayjs.extend(duration);
type VideoFieldProps = {
  onRecordingChange?: (recordingState: RecordingState) => any;
  autoStartRecording?: boolean;
  publicURL?: string;
  videoURL?: string;
};
function VideoField({
  onRecordingChange,
  autoStartRecording,
  publicURL,
  videoURL,
}: VideoFieldProps) {
  const { recordedChunks } = useRecordingContext();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [mode, setMode] = useState("");
  const [videoDeviceOptions, setVideoDeviceOptions] = useState([]);
  const [audioDeviceOptions, setAudioDeviceOptions] = useState([]);
  const [audioSource, setAudioSource] = useState([]);
  const [videoSource, setVideoSource] = useState([]);
  const videoEl = useRef(null);
  const [recorderId] = useState(uuidv4());
  const {
    getMediaStream,
    createRecording,
    stopRecording,
    recordingState,
    recordingDuration,
    getDevices,
  } = useRecordVideo({ maxDuration: 20, mediaRecorder });

  const onClickRecord = async () => {
    if (window["stream"]) {
      const tracks = await window["stream"].getTracks();
      tracks.forEach((track) => track.stop());
      console.log(window["stream"].getTracks(), "STOPPED");
    }

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: localStorage.getItem("videoSource")
          ? localStorage.getItem("videoSource")
          : undefined,
        facingMode: "user",
        height: { ideal: 300 },
      },
      audio: {
        deviceId: localStorage.getItem("audioSource")
          ? localStorage.getItem("audioSource")
          : undefined,
      },
    };

    window["stream"] = await getMediaStream(constraints);

    const mediaRecorder = createRecording({
      onStop: () => {
        setMode("preview");
      },
    });

    setMediaRecorder(mediaRecorder);

    console.log({ mediaRecorder });

    if (!!videoEl?.current) {
      if ("srcObject" in videoEl?.current) {
        videoEl.current.srcObject = window["stream"];
      } else {
        videoEl.current.src = URL.createObjectURL(window["stream"]);
      }
      videoEl.current.muted = true;
      videoEl.current.play();
    }

    // get video devices
    getDevices("videoinput").then((devices) => {
      const videoDevices = devices.map((device) => ({
        value: device.deviceId,
        label: device.label,
      }));

      setVideoDeviceOptions(videoDevices);
    });

    // get audio devices
    getDevices("audioinput").then((devices) => {
      const audioDevices = devices.map((device) => ({
        value: device.deviceId,
        label: device.label,
      }));

      setAudioDeviceOptions(audioDevices);
    });
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<any>) => {
      if (
        !!mediaRecorder &&
        e.code === "Space" &&
        mode === "record" &&
        e.target["type"] !== "text" &&
        e.target["type"] !== "textarea"
      ) {
        e.preventDefault();
        if (recordingState === RecordingState.RECORDING) {
          stopRecording(mediaRecorder);
        } else {
          mediaRecorder.start();
        }
      }
    },
    [mediaRecorder, mode, recordingState]
  );

  const onUpload = () => {
    setMode("preview");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    onRecordingChange && onRecordingChange(recordingState);

    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [recordingState, mediaRecorder, mode]);

  useEffect(() => {
    if (autoStartRecording) {
      setMode("record");
    } else {
      setMode("preview");
    }
  }, [autoStartRecording]);

  useEffect(() => {
    if (mode === "record") {
      onClickRecord();
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    if (!!mediaRecorder) {
      onClickRecord();
    }
  }, [audioSource, videoSource]);

  return (
    <div>
      <OptionButtons
        marginBottom="minor-4"
        defaultValue={autoStartRecording ? "record" : "preview"}
        orientation="horizontal"
        value={mode}
        type="radio"
        onChange={setMode as any}
        options={[
          {
            label: "Preview",
            value: "preview",
            disabled: !(publicURL || recordedChunks.length),
          },
          { label: "Record", value: "record" },
          { label: "Upload", value: "upload" },
        ]}
      />

      {mode === "record" && (
        <>
          <Box position="relative" width={"100%"} height={"300px"}>
            <video
              ref={videoEl}
              id={"video#" + recorderId}
              style={{
                position: "relative",
                objectFit: "cover",
                marginBottom: "10px",
              }}
              width={mode === "record" ? "100%" : "0"}
              height={mode === "record" ? "100%" : "0"}
            ></video>

            {!!mediaRecorder && recordingState !== RecordingState.RECORDING && (
              <>
                {/* Start button */}
                <Clickable
                  position="absolute"
                  bottom="0"
                  left="10%"
                  transform="translate(-50%, -50%)"
                  cursor="pointer"
                  onClick={() => {
                    console.log(mediaRecorder.stream);
                    mediaRecorder.start();
                  }}
                >
                  <Tooltip content="Start Recording">
                    <Icon
                      fontSize="600"
                      color="#EE5B59"
                      icon={faCircle}
                      type="font-awesome"
                      _hover={{ color: "#EC4946" }}
                    ></Icon>
                  </Tooltip>
                </Clickable>
              </>
            )}

            {/* menu button */}
            {!!mediaRecorder && (
              <RecordOptionsModal
                setAudioSource={setAudioSource}
                setVideoSource={setVideoSource}
                audioDeviceOptions={audioDeviceOptions}
                videoDeviceOptions={videoDeviceOptions}
              ></RecordOptionsModal>
            )}
            {/* face outline */}
            {!!mediaRecorder && (
              <Box
                position="absolute"
                top="50%"
                right="50%"
                transform="translate(50%, -50%)"
                zIndex="101"
                cursor="pointer"
              >
                <Image
                  width="200px"
                  height="200px"
                  src="/face_outline.png"
                ></Image>
              </Box>
            )}
            {/* stop button */}
            {!!mediaRecorder && recordingState === RecordingState.RECORDING && (
              <Clickable
                position="absolute"
                bottom="0"
                left="10%"
                transform="translate(-50%, -50%)"
                zIndex="100"
                cursor="pointer"
                onClick={() => {
                  stopRecording(mediaRecorder);
                }}
              >
                <Tooltip content="Stop Recording">
                  <Icon
                    fontSize="600"
                    color="#EE5B59"
                    icon={faStopCircle}
                    type="font-awesome"
                    _hover={{ color: "#EC4946" }}
                  ></Icon>
                </Tooltip>
              </Clickable>
            )}

            {!!mediaRecorder && (
              <>
                {/* Timer */}
                <Text.Block
                  background="rgba(94, 74, 227, 0.5)"
                  padding="5px"
                  position="absolute"
                  bottom="5%"
                  borderRadius="10px"
                  border="1px solid #5E4AE3"
                  right="5%"
                  transform="translate(-5%, -50%)"
                  textAlign="center"
                  marginY="minor-2"
                  color="#fff"
                >
                  {`${recordingDuration.format("mm:ss")}/00:20`}
                </Text.Block>
              </>
            )}
          </Box>

          {/* Hint */}
          <Stack marginTop="minor-4" alignX="center">
            <Alert>
              <Text>
                <Text use="strong">Hint:</Text> Use <Key>Space</Key> to{" "}
                {RecordingState.INACTIVE ? "start " : "stop "}
                recording.
              </Text>
            </Alert>
          </Stack>
        </>
      )}

      {mode === "upload" && (
        <>
          <Box
            display="flex"
            marginTop="minor-4"
            marginBottom={
              recordingState === RecordingState.RECORDING ? "minor-2" : "0"
            }
          >
            <VideoUploadButton onUpload={onUpload}></VideoUploadButton>
          </Box>
        </>
      )}
      {mode === "preview" && (
        <>
          <Box marginBottom={"minor-12"}>
            {recordedChunks.length > 0 && videoURL ? (
              <VideoPreview url={videoURL || publicURL}></VideoPreview>
            ) : (
              <>
                {publicURL && recordingState !== RecordingState.RECORDING && (
                  <VideoPreview url={publicURL}></VideoPreview>
                )}
              </>
            )}

            {/* Video placeholder */}
            {!publicURL &&
              recordingState !== RecordingState.RECORDING &&
              recordedChunks.length === 0 && (
                <VideoPreview url={""}></VideoPreview>
              )}
          </Box>
        </>
      )}
    </div>
  );
}

export default VideoField;
