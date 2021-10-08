import {Flex, Box, Button, Card, Columns, Heading, Text, Link } from "bumbag";
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
import {
  faSmile,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import SelphTiles from '../../components/dashboard-comps/selphTiles'
// import Link from "next/link";


function DashboardIndexPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: totalSelphs, isLoading: countSelphsIsLoading } = useCountSelphs(
    { query: { "user.id": user?.id } }
  );
  const { data: totalImprints, isLoading: countImprintsIsLoading } =
    useCountImprints({ query: { "selph.user.id": user?.id } });
  // const setStepIndex = useStore((store) => store.setStepIndex);
  // const stepIndex = useStore((store) => store.tour.stepIndex);
  const [, setJoyrideStep] = useAtom(joyrideStepAtom);

  return (
    <>
      <Head>
        <title>Dashboard | {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>



      <DashboardLayout>


      <Box marginBottom="major-5">
        <SelphTiles/>
        <Flex alignX="right">
        <Link href="/analytics"> 
        <Text color="blue" > ▶ more analytics</Text>
        </Link>
       </Flex>
      </Box>







        <Columns spacing="major-8">
          <Columns.Column>

            <CountCard
              text="My Selphs"
              value={totalSelphs}
              isLoading={countSelphsIsLoading}
              icon={faUser}
            ></CountCard>

          </Columns.Column>
          
          <Columns.Column>
            <CountCard
              text="My Imprints"
              value={totalImprints}
              isLoading={countImprintsIsLoading}
              icon={faSmile}
            ></CountCard>
          </Columns.Column>
          <Columns.Column></Columns.Column>
          {/* <Columns.Column>
            <CountCard
              text="Total Interactions"
              value={2}
              icon={faUserCircle}
            ></CountCard>
          </Columns.Column> */}
        </Columns>
        <Card>
          <Box
            marginBottom="minor-8"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading use="h3">My Selphs</Heading>

            <div
              className={
                typeof JOYRIDE_STEPS[0].target === "string" &&
                JOYRIDE_STEPS[0].target.slice(1)
              }
            >
              <Button
                palette="dark"
                onClick={() => {
                  router.push("/dashboard/new-selph");
                  setJoyrideStep(1);
                }}
              >
                New Selph
              </Button>
            </div>
          </Box>
          <SelphCardList></SelphCardList>
        </Card>
      </DashboardLayout>
    </>
  );
}

export default DashboardIndexPage;
