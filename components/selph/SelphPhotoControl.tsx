import useChangeSelphThumbnail from "@/hooks/selph/mutations/useChangeSelphThumbnail";
import useFileUpload from "@/hooks/useFileUpload";
import { Box, Spinner } from "bumbag";
import React, { useCallback, useEffect, useState } from "react";
import { useIsFetching, useQueryClient } from "react-query";

interface SelphPhotoControlProps {
  selphId: number;
  thumbnail?: string;
}

function SelphPhotoControl({ thumbnail, selphId }: SelphPhotoControlProps) {
  const {
    isLoading,
    mutate: changeSelphThumbnail,
    data,
  } = useChangeSelphThumbnail({
    onSuccess: () => {
      queryClient.invalidateQueries(["selphs", { id: Number(selphId) }]);
    },
  });

  const [thumbUrl, setThumbUrl] = useState(thumbnail);
  const queryClient = useQueryClient();

  const { getRootProps, getInputProps } = useFileUpload({
    accept: "image/*",
    multiple: false,
    noClick: false,
    noKeyboard: false,
    onFilesDropped: (files) => {
      changeSelphThumbnail({ selphId, thumbnail: files[0] });
      console.log(files);
    },
  });

  useEffect(() => {
    if (thumbnail) {
      setThumbUrl(thumbnail);
    }
    if (thumbnail?.startsWith("data")) setThumbUrl(thumbnail);
    if (!thumbnail) setThumbUrl("/TS-Block.png");
  }, [thumbnail]);

  useEffect(() => {
    if (data?.thumbnail?.formats?.thumbnail.url)
      setThumbUrl(data?.thumbnail?.formats?.thumbnail.url);
  }, [data]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Box
        position="relative"
        overflow="hidden"
        width="70px"
        height="70px"
        borderRadius="3"
        cursor="pointer"
      >
        <img
          src={thumbUrl}
          width="70"
          height="70"
          style={{ objectFit: "cover" }}
        ></img>

        {isLoading && (
          <Box
            position="absolute"
            top="0px"
            alignItems="center"
            display="flex"
            justifyContent="center"
            background="#20213665"
            height="100%"
            width="100%"
          >
            <Spinner></Spinner>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default SelphPhotoControl;
