import { useCallback, useEffect, useState } from "react";
import { stopwatch } from "durations";
import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import useRecordingContext from "./useRecordingContext";
import { recordingStateAtom } from "atoms/recordingStateAtom";
import { useAtom } from "jotai";

dayjs.extend(duration);

interface UseRecordVideoProps {
  mediaRecorder: MediaRecorder;
  /** Max length in seconds. */
  maxDuration: number;
}

interface CreateRecordingOptions {
  onStart?: (e: Event) => any;
  onStop?: (e: Event) => any;
  onDataAvailable?: (e: Event) => any;
}

export enum RecordingState {
  RECORDING = "recording",
  PAUSED = "paused",
  INACTIVE = "inactive",
}

function useRecordVideo({ maxDuration, mediaRecorder }: UseRecordVideoProps) {
  const [recordingDuration, setRecordingDuration] = useState(dayjs.duration(0));
  const [watch] = useState(stopwatch());
  const { recordedChunks, setRecordedChunks } = useRecordingContext();
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.INACTIVE
  );
  const [, setRecordingStateAtom] = useAtom(recordingStateAtom);

  const getDevices = async (kind?: MediaDeviceInfo["kind"]) => {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (kind) {
        return devices.filter((currentDevice) => currentDevice.kind === kind);
      }

      return devices;
    });
  };

  const getMediaStream = async (constraints: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  const createRecording = useCallback(
    ({ onStart, onDataAvailable, onStop }: CreateRecordingOptions) => {
      const recorder = new MediaRecorder(window["stream"]);

      recorder.onstart = (e) => {
        setRecordedChunks([]);
        watch.start();
        setRecordingState(RecordingState.RECORDING);
        setInterval(() => {
          if (watch.isRunning()) {
            setRecordingDuration(dayjs.duration(watch.duration().millis()));
          }
        }, 500);
        if (typeof onStart !== "undefined") onStart(e);
      };

      recorder.onstop = (e) => {
        watch.reset();
        setRecordingDuration(dayjs.duration(0));
        setRecordingState(RecordingState.INACTIVE);
        if (typeof onStop !== "undefined") onStop(e);
      };

      recorder.ondataavailable = (e) => {
        setRecordingState(RecordingState.RECORDING);
        onDataAvailable(e);
      };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prevRecordedChunks) => [
            ...prevRecordedChunks,
            e.data,
          ]);
        }
      };

      return recorder;
    },
    [window["stream"]]
  );

  const stopRecording = (mediaRecorder: MediaRecorder) => {
    if (mediaRecorder instanceof MediaRecorder) {
      // mediaRecorder.stream.getAudioTracks()[0].stop();
      // mediaRecorder.stream.getVideoTracks()[0].stop();
      mediaRecorder.stop();
    }
  };

  useEffect(() => {
    // stop recording if max duration is reached
    if (
      Number(watch.duration().millis()) >= Number(maxDuration * 1000) &&
      mediaRecorder
    ) {
      stopRecording(mediaRecorder);
    }
  }, [recordingDuration, mediaRecorder]);

  useEffect(() => {
    //@ts-ignore
    setRecordingStateAtom(recordingState);
  }, [recordingState]);

  return {
    recordingState,
    recordedChunks,
    mediaRecorder,
    recordingDuration,
    setRecordedChunks,
    getMediaStream,
    createRecording,
    stopRecording,
    getDevices,
  };
}

export default useRecordVideo;
