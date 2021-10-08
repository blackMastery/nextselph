import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Box, Text, Card, Button, Icon } from "bumbag";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  type?: string;
}

const AddImprintCard = ({ type }: Props) => {
  const router = useRouter();
  const { selphId } = router.query;
  const typeText = {
    GOODBYE: "Add Goodbye Imprint",
    CONFUSED: "Add Confused Imprint",
    GREETING: "Add Greeting Imprint",
    IDLE: "Add Idle Imprint",
  };

  return (
    <>
      <Card
        padding="40px"
        onClick={() =>
          router.push({
            pathname: "/dashboard/selph/[selphId]/imprint/new",
            query: { selphId },
          })
        }
        use={Button}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        background="hsl(209 13.3% 95.3%)"
        _hover={{ background: "hsl(209 12.2% 93.2%)" }}
        _active={{ background: "hsl(208 11.7% 91.1%)" }}
        cursor="pointer"
      >
        <Box
          display="flex"
          fontSize="200"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            marginRight="minor-2"
            color="#687076"
            icon={faPlusCircle}
            type="font-awesome"
          ></Icon>
          <Text.Block color="#687076" fontSize="200" textAlign="center">
            {typeText[type] ? typeText[type] : "Add Imprint"}
          </Text.Block>
        </Box>
      </Card>
    </>
  );
};

export default AddImprintCard;
