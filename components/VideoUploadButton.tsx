import useFileUpload from "@/hooks/useFileUpload";
import useRecordingContext from "@/hooks/useRecordingContext";
import getBlobDuration from "get-blob-duration";
import { Button } from "bumbag";
import React from "react";

function VideoUploadButton({ onUpload }: { onUpload?: () => any }) {
  const { setRecordedChunks } = useRecordingContext();
  const { getInputProps, getRootProps, open } = useFileUpload({
    accept: "video/*",
    onFilesDropped: (acceptedFiles) => {
      setRecordedChunks([]);
      const video = acceptedFiles[0];

      video.arrayBuffer().then(async (arrayBuffer) => {
        console.log({ fileType: acceptedFiles[0].type });
        let blob = new Blob([new Uint8Array(arrayBuffer)], {
          type: video.type,
        });
        Object.assign(blob, { ext: video.name.split(".").pop() });

        const duration = await getBlobDuration(blob);
        if (duration > 20) {
          blob["duration"] = duration;
        }
        setRecordedChunks([blob]);
        console.log(blob);
      });

      if (acceptedFiles.length > 0) {
        onUpload && onUpload();
      }
    },
    noClick: true,
    noKeyboard: true,
  });

  // const files = acceptedFiles.map(file => (
  //     <li key={file?.path}>
  //         {file?.path} - {file.size} bytes
  //     </li>
  // ));

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        type="button"
        palette="dark"
        onClick={() => {
          open();
        }}
      >
        Choose File
      </Button>
      {/* <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside> */}
    </div>
  );
}

export default VideoUploadButton;
