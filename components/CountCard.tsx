import { Box, Card, Heading, Text, Icon, Spinner, ParsedIcon } from "bumbag";
import React from "react";

type CountCardProps = {
  text: string;
  value: number;
  icon: string | ParsedIcon;
  isLoading?: boolean;
};

function SelphCountCard({ text, value, icon, isLoading }: CountCardProps) {
  return (
    <Card>
      <Box display="flex">
        <Box
          background="#000"
          width="40px"
          marginRight="minor-8"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="2"
        >
          <Icon color="#ffffffd9" icon={icon} type="font-awesome"></Icon>
        </Box>
        <div>
          {isLoading ? (
            <Spinner></Spinner>
          ) : (
            <Text.Block fontWeight="bold" color="#000" marginBottom="minor-3">
              {text}
            </Text.Block>
          )}
          <Heading use="h3">{value}</Heading>
        </div>
      </Box>
    </Card>
  );
}

export default SelphCountCard;
