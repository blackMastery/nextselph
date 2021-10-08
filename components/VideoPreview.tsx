import { Text } from "bumbag";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Player, ControlBar, ClosedCaptionButton } from "video-react";

interface VideoPreviewProps {
  url: string;
  label?: string;
}

function VideoPreview({ url, label }: VideoPreviewProps) {
  const playerId = uuidv4();
  // <button class="video-react-big-play-button
  // video-react-big-play-button-left" type="button" aria-live="polite"
  // tabindex="0"><span class="video-react-control-text">Play
  // Video</span></button>

  useEffect(() => {
    const playButtons = document.getElementsByClassName(
      "video-react-big-play-button"
    );

    if (url === "" && playButtons.length) {
      playButtons[0]?.["style"].setProperty("display", "none");
    }

    if (!!url.length && playButtons.length) {
      playButtons[0]?.["style"].removeProperty("display");
    }
  }, [url]);

  return (
    <div>
      <Player
        id={"videoPlayer#" + playerId}
        playsInline
        height={300}
        width={"100%"}
        fluid={false}
        preload="metadata"
        crossOrigin="anonymous"
        autoPlay
        src={url}
      >
        <ControlBar autoHide={false}>
          <ClosedCaptionButton order={7} />
        </ControlBar>
      </Player>
    </div>
  );
}

export default VideoPreview;
