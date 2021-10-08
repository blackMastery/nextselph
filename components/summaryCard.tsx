import { Box, Button, Card, Columns, Divider,  Heading } from "bumbag";
import React from "react";




export default function SummaryCard(props){
    const {name, color, data } = props;


    return (
        <Card color="primaryTint" borderRadius="1" title={name}  backgroundColor={color} variant="shadowed">
        <Divider />
        <Box padding="major-1" fontSize="400" fontWeight="bold">

            {data}
        </Box>
        </Card>
    )
}