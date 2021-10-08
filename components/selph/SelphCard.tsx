import { Box, Card, Stack, Text } from "bumbag";
import React from "react";

type SelphCardProps = {
  name: string;
  description: string;
  thumbnail: string | null;
  status: boolean;
};

function SelphCard({ name, thumbnail, description, status }: SelphCardProps) {
  return (
    <div>
      <Card
        variant="bordered"
        cursor="pointer"
        transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
        _hover={{
          boxShadow: "0 3px 9px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Stack spacing="minor-2">
          <Stack alignX="right">
            <Text.Block use="sub" color={status ? "success" : "danger"}>
              {status ? "Published" : "Unpublished"}
            </Text.Block>
          </Stack>
          <Box display="flex">
            <Box
              overflow="hidden"
              width="70px"
              height="70px"
              marginRight="minor-2"
              borderRadius="3"
            >
              <img
                src={
                  thumbnail
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${thumbnail}`
                    : "/TS-Block.png"
                }
                width="70"
                height="70"
                style={{ objectFit: "cover" }}
              ></img>
            </Box>
            <Box>
              <Text.Block marginBottom="minor-4" fontSize="300" use="strong">
                {name}
              </Text.Block>
              <Text.Block>{description}</Text.Block>
            </Box>
          </Box>
        </Stack>
      </Card>
    </div>
  );
}

export default SelphCard;
