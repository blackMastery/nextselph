import { Box, Button, Card, Columns, Divider,  Heading, SelectMenu } from "bumbag";
import React from "react";
import DashboardLayout, { JOYRIDE_STEPS } from "../../layouts/dashboard-layout";
import Head from "next/head";
import CountCard from "../../components/CountCard";
import SelphCardList from "../../components/selph/SelphCardList";
import { useRouter } from "next/router";
// import useStore from "../../store";
import useUser from "@/hooks/useUser";
import useCountImprints from "@/hooks/imprints/queries/useCountImprints";
import useCountSelphs from "@/hooks/selph/queries/useCountSelphs";
import { useAtom } from "jotai";
import { joyrideStepAtom } from "atoms/joyrideAtom";
import { ResponsiveLine } from '@nivo/line'
import MyData from "./mydata.json";
import SummaryCard from '../../components/summaryCard'
import AnalyticsBarChart from '../../components/charts/barChart'
import useSelphs from "@/hooks/selph/queries/useSelphs";
import SelectSelph from '../../components/formutils/select'
import SelphTiles from '../../components/dashboard-comps/selphTiles'
import Link from "next/link";


 function  AnalyticPage(){
    const [value, setValue] = React.useState();
    const [day, setDay] = React.useState();
    const { data: user, isLoading: loading } = useUser();




    console.log(user)

   return (

        <DashboardLayout title="Analytics" label="Analytics">
            <Box marginBottom="major-3">

            <Columns spacing="major-2">

            <Columns.Column spread={2} spreadOffset="left">
                <SelectSelph userid={user ? user.id: 0 }/>
            </Columns.Column>
                

                
            <Columns.Column spread={2} >
            <SelectMenu
                onChange={setDay}
                options={[
                    { key: 1, label: 'Last 30 Days', value: 30},
                    { key: 2, label: 'Last 20 Days', value: 20 },
                    { key: 3, label: 'Last 10 Days', value: 10 },
                    { key: 4, label: 'Today', value: 'mangos' }
                ]}
                placeholder="Periods"
                value={day}
                />
            </Columns.Column>


            </Columns>
            </Box>
            <Box marginBottom="major-5">

           <SelphTiles/>
           </Box>


            <Columns spacing="major-2">

            <Columns.Column spread={6} >
            <Heading use="h4">Top Engagements </Heading>
              
            <div style={{ height: "20em", width: "100%" }}>

            <ResponsiveLine
            data={MyData}
            margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
            xScale={{ type: 'linear' }}
            yScale={{ type: 'linear', stacked: true, min: 0, max: 2500 }}
            yFormat=" >-.2f"
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
            tickValues: [
                0,
                20,
                40,
                60,
                80,
                100,
                120
            ],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2f',
            // legend: 'price',
            // legendOffset: 36,
            // legendPosition: 'middle'
            }}
            axisLeft={{
            tickValues: [
                0,
                500,
                1000,
                1500,
                2000,
                2500
            ],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2s',
            // legend: 'volume',
            // legendOffset: -40,
            // legendPosition: 'middle'
            }}
            enableGridX={false}
            colors={{ scheme: 'spectral' }}
            lineWidth={1}
            pointSize={4}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
            gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
            />
            </div>

                    
            </Columns.Column>
                    
            <Columns.Column spread={6} >
            <Heading use="h4">Active Users</Heading>
                    
                <div style={{  height: "20em", width: "100%"  }}>
                        <ResponsiveLine
                    data={MyData}
                    margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
                    xScale={{ type: 'linear' }}
                    yScale={{ type: 'linear', stacked: true, min: 0, max: 500 }}
                    yFormat=" >-.2f"
                    curve="cardinal"
                    axisTop={null}
                    axisRight={{
                        tickValues: [
                            0,
                            100,
                            150,
                            200,
                            300,
                            350,
                            400,
                            450,
                            500,
                        
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2s',
                        legend: '',
                        legendOffset: 0
                    }}
                    axisBottom={{
                        tickValues: [
                            0,
                            20,
                            40,
                            60,
                            80,
                            100,
                            120
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2f',
                        legend: 'price',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickValues: [
                            0,
                            100,
                            150,
                            200,
                            300,
                            350,
                            400,
                            450,
                            500
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2s',
                        legend: 'volume',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    colors={{ scheme: 'spectral' }}
                    lineWidth={1}
                    enablePoints={false}

                    pointSize={4}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
                    gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
     
                />
                </div>

            </Columns.Column>


        

            </Columns>


            <Columns spacing="major-2">

            <Columns.Column spread={6} >
            <Heading use="h4">New Engagements</Heading>
                    
                <div style={{  height: "20em", width: "100%"  }}>
                        <ResponsiveLine
                    data={MyData}
                    margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
                    xScale={{ type: 'linear' }}
                    yScale={{ type: 'linear', stacked: true, min: 0, max: 2500 }}
                    yFormat=" >-.2f"
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickValues: [
                            0,
                            20,
                            40,
                            60,
                            80,
                            100,
                            120
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2f',
                        legend: 'price',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickValues: [
                            0,
                            500,
                            1000,
                            1500,
                            2000,
                            2500
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2s',
                        legend: 'volume',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    colors={{ scheme: 'spectral' }}
                    lineWidth={1}
                    pointSize={4}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
                    gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
            
                />
                </div>

            </Columns.Column>


           <Columns.Column spread={6} >
            <Heading use="h4">Transactions</Heading>
                    
                <div style={{  height: "20em", width: "100%"  }}>
                        <ResponsiveLine
                    data={MyData}
                    margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
                    xScale={{ type: 'linear' }}
                    yScale={{ type: 'linear', stacked: true, min: 0, max: 2500 }}
                    yFormat=" >-.2f"
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickValues: [
                            0,
                            20,
                            40,
                            60,
                            80,
                            100,
                            120
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2f',
                        legend: 'price',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickValues: [
                            0,
                            500,
                            1000,
                            1500,
                            2000,
                            2500
                        ],
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: '.2s',
                        legend: 'volume',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    colors={{ scheme: 'spectral' }}
                    lineWidth={1}
                    pointSize={4}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
                    gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
        
                />
                </div>

            </Columns.Column>
            </Columns>


            <Columns spacing="major-2">

<Columns.Column spread={6} >
<Heading use="h4">Top Selphs</Heading>
        
    <div style={{  height: "20em", width: "100%"  }}>
            <AnalyticsBarChart/>
   
    </div>

</Columns.Column>


<Columns.Column spread={6} >
<Heading use="h4">Top Imprints</Heading>
    <div style={{  height: "20em", width: "100%"  }}>
        <AnalyticsBarChart/>
</div>

</Columns.Column>
</Columns>
       </DashboardLayout>

   )



}



export default AnalyticPage