import { Box, Button, Card, Columns, Divider,  Heading, SelectMenu } from "bumbag";
import SummaryCard from '../summaryCard'









function SelphTiles (){
    return (
        <Columns spacing="major-2">
        {/* panels */}


        <Columns.Column>
        <SummaryCard
        name="Total Engagements"
        color="#7bbe76"
        data={0}
        />
        </Columns.Column>
     

        <Columns.Column>
        <SummaryCard
        name="Active Engagements"
        color="#21897e"
        data={100}
        />
        </Columns.Column>

        <Columns.Column>
        <SummaryCard
        name="New Engagements"
        color="#5998c5"
        data={200}
        />
        </Columns.Column>

        <Columns.Column>
        <SummaryCard
        name="Msg Sent"
        color="#1768ac"
        data={100}
        />
        </Columns.Column>

        <Columns.Column>
        <SummaryCard
        name="Msg Received"
        color="#03045e"
        data={100}
        />
        </Columns.Column>
        </Columns>
    )
}


export default SelphTiles