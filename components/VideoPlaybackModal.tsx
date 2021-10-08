import React, { useEffect, useState } from "react";
import localForage from "localforage";
import { Button, Dialog, Icon, Modal, Stack } from "bumbag";
import { Player, ControlBar, ClosedCaptionButton } from "video-react";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

type VideoPlaybackModalProps = {
  blobId?: string;
  imprintId?: number;
  publicUrl?: string;
  captionUrl?: string;
  type: string;
  prompt: string;
};

function VideoPlaybackModal({
  prompt,
  type,
  publicUrl,
  blobId,
  captionUrl,
}: VideoPlaybackModalProps) {
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    // let video;

    if (publicUrl) {
      setVideoURL(process.env.NEXT_PUBLIC_BACKEND_URL + publicUrl);
      return;
    }

    if (blobId) {
      localForage.getItem("imprint_" + blobId).then((blob) => {
        setVideoURL(window.URL.createObjectURL(blob));
      });
    }
    // if (imprintId) {
    //   video = document.getElementById("impVideoPlayer_" + imprintId);
    //   fetch("http://localhost:3001" + publicUrl)
    //     .then((response) => response.blob())
    //     .then((blob) => {
    //       console.log("fetched", window.URL.createObjectURL(blob));
    //       video.src = window.URL.createObjectURL(blob);
    //     });
    // }
  }, [publicUrl, blobId]);

  // const playVideo = () => {
  //   let video: any = document.getElementById(
  //     "impVideoPlayer_" + (blobId ? blobId : imprintId)
  //   );
  //   video.currentTime = 0;
  //   video.play();
  // };
  return (
    <div>
      <Modal.State animated>
        <Dialog.Modal
          showCloseButton={true}
          title={`${prompt} - ${type}`}
          hideOnClickOutside={true}
          baseId={blobId}
          expand
        >
          {/* <video
            id={"impVideoPlayer_" + (blobId ? blobId : imprintId)}
            width={"500"}
            height={"300"}
          ></video> */}

          {videoURL && (
            <Player
              playsInline
              height={300}
              width={500}
              fluid={false}
              poster="/assets/poster.png"
              preload="metadata"
              crossOrigin="anonymous"
            >
              <source src={videoURL || ""} />

              <track
                kind="captions"
                src={process.env.NEXT_PUBLIC_BACKEND_URL + captionUrl}
                srcLang="en"
                label="English"
                default
              />

              <ControlBar autoHide={false}>
                <ClosedCaptionButton order={7} />
              </ControlBar>
            </Player>
          )}
          {/* <Stack alignX="center">
            <Button onClick={() => playVideo()}>Play</Button>
          </Stack> */}
        </Dialog.Modal>
        <Modal.Disclosure
          //@ts-ignore
          use={(props) => (
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                {...props}
                background="none"
                border="none"
                outline="none"
                variant="link"
                fontSize="600"
                transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
                _hover={{
                  color: "primary",
                  transform: "scale(1.25, 1.25)",
                }}
                cursor="pointer"
              >
                <Icon icon={faPlayCircle} type="font-awesome"></Icon>
              </Button>
            </div>
          )}
        >
          Open modal
        </Modal.Disclosure>
      </Modal.State>
    </div>
  );
}

export default VideoPlaybackModal;
