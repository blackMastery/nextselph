import {
  Spinner,
  Clickable,
  Box,
  Card,
  Stack,
  Text,
  Tag,
  useBreakpoint,
} from "bumbag";
import React, { useEffect, useState } from "react";
import VideoPlaybackModal from "../VideoPlaybackModal";
import Pusher from "pusher-js";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { Imprint } from "models/imprint";
import ImprintCardMenu from "./ImprintCardMenu";
import useRooms from "@/hooks/useRooms";

const pusher = new Pusher("44cfcedc3cd5ef7ee6a8", {
  cluster: "us2",
});

type ImprintDetails = {
  reviewed: boolean;
  published: boolean;
  publicUrl?: string;
  captionUrl?: string;
  imprintId?: number;
  uniqueId?: string;
  blobId?: string;
  type: string;
  prompt: string;
  transcript: string;
  thumbnail: string;
  transcriptionStatus: string;
};

interface ImprintCardProps {
  imprintDetails: ImprintDetails;
}

function ImprintCard({
  imprintDetails: {
    prompt,
    thumbnail,
    transcript,
    type,
    blobId,
    captionUrl,
    imprintId,
    publicUrl,
    uniqueId,
    published,
    reviewed,
  },
}: ImprintCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [liveTranscriptionStatus, setLiveTranscriptionStatus] = useState("");
  const [liveTranscriptionStage, setLiveTranscriptionStage] = useState("");
  const {
    query: { selphId },
  } = useRouter();

  const { joinRoom, socket } = useRooms();

  useEffect(() => {
    if (socket && imprintId && selphId) {
      joinRoom(`imprint-${imprintId}`, (data) => {
        !!data?.value && setLiveTranscriptionStatus(data?.value);
        !!data?.stage && setLiveTranscriptionStage(data?.stage);

        if (data?.value === "failed") {
          // channel.unbind("transcription_status");
        }

        if (data?.value === "success") {
          queryClient.invalidateQueries([
            "imprints",
            { selphId: Number(selphId) },
          ]);
        }
      });

      return () => socket.disconnect();
    }
  }, [socket, imprintId, selphId]);

  return (
    <div>
      <Card
        position="relative"
        onClick={() =>
          router.push({
            pathname: "/dashboard/selph/[selphId]/imprint/[imprintId]/edit",
            query: { selphId, imprintId },
          })
        }
        transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
        cursor="pointer"
        _hover={{
          boxShadow: "0 3px 9px rgba(0, 0, 0, 0.3)",
        }}
        key={blobId}
        paddingTop="minor-8"
      >
        {reviewed && (
          <Tag
            size="small"
            borderRadius="0"
            variant="outlined"
            position="absolute"
            top="0"
            left="0"
            palette={published ? "success" : "danger"}
          >
            {published ? "Published" : "Unpublished"}
          </Tag>
        )}

        {!reviewed && (
          <Clickable
            //@ts-ignore
            use={(props) => <Tag size="small" {...props}></Tag>}
            borderRadius="0"
            background="#ED5E05"
            cursor="pointer"
            transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
            size="small"
            position="absolute"
            top="0"
            left="0"
            palette="warning"
            _hover={{
              transform: "scale(1.12)",
              backgroundColor: "#BD4B05",
            }}
          >
            Pending Review
          </Clickable>
        )}

        <Box
          position="absolute"
          top="0"
          onClick={(e) => e.stopPropagation()}
          right="0"
          display="flex"
        >
          <ImprintCardMenu
            imprintDetails={{
              prompt,
              uniqueId,
              type,
              transcript,
              imprintId,
              reviewed,
            }}
          ></ImprintCardMenu>
        </Box>
        {liveTranscriptionStatus === "processing" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="50"
            height="100%"
            width="100%"
            background="rgba(0,0,0,0.65)"
            position="absolute"
            bottom="0"
            left="50%"
            transform="translate(-50%, 0)"
          >
            <Spinner color="#fff" />
            <Box color="#fff">
              <Text marginLeft="minor-2" fontWeight="bold">
                Processing transcript...
              </Text>
              <Text.Block marginLeft="minor-2" fontWeight="normal">
                {liveTranscriptionStage}
              </Text.Block>
            </Box>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="inline-flex">
            <Box
              flexBasis="70px"
              overflow="hidden"
              width="70px"
              height="70px"
              borderRadius="3"
            >
              <img
                src={
                  thumbnail
                    ? (thumbnail.startsWith("data")
                        ? ""
                        : process.env.NEXT_PUBLIC_BACKEND_URL + "/file/") +
                      thumbnail
                    : "/TS-Block.png"
                }
                width="70"
                height="70"
                style={{ objectFit: "cover" }}
              ></img>
            </Box>

            <div>
              <Stack flexBasis="50%" marginX="minor-2" paddingY="10px">
                <Text.Block fontSize="150" marginBottom="minor-2">
                  {prompt}
                </Text.Block>
                <Text.Block fontSize="100" color="grey">
                  {type}
                </Text.Block>
              </Stack>
            </div>
          </Box>
          {/* <Box {...modalProps}>Hello</Box> */}
          <div onClick={(e) => e.stopPropagation()}>
            {imprintId && (
              <VideoPlaybackModal
                publicUrl={publicUrl}
                captionUrl={captionUrl}
                imprintId={imprintId}
                prompt={prompt}
                type={type}
              ></VideoPlaybackModal>
            )}
            {blobId && (
              <VideoPlaybackModal
                blobId={blobId}
                prompt={prompt}
                type={type}
              ></VideoPlaybackModal>
            )}
          </div>
        </Box>
      </Card>
    </div>
  );
}

export default ImprintCard;
