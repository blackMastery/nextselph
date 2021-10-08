import React, { ReactNode, useEffect, useState } from "react";
import {
  PageWithSidebar,
  PageContent,
  Heading,
  Button,
  Box,
  Breadcrumb,
  Spinner,
  usePage,
  Icon,
} from "bumbag";
import Sidebar from "../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import useUser from "../hooks/useUser";
import ConfirmEmail from "../components/ConfirmEmail";
// import dynamic from "next/dynamic";
// const Tour = dynamic(() => import("reactour"), { ssr: false });
import Joyride, { EVENTS, ACTIONS, Step } from "react-joyride";
// import useStore from "../store";
import useSandbox from "@/hooks/useSandbox";
import { useAtom } from "jotai";
import { joyrideStepAtom, useJoyrideStepAtomDevtools } from "atoms/joyrideAtom";
import {
  faBars,
  faHamburger,
  faLongArrowAltLeft,
  faOutdent,
} from "@fortawesome/free-solid-svg-icons";

export const JOYRIDE_STEPS: Step[] = [
  {
    title: "Introduction",
    target: `.onboarding-step-1`,
    content: `Welcome to TrueSelph. This guide will introduce you to the core functionalities of ${process.env.NEXT_PUBLIC_SITE_NAME}. \nLet's start by creating a new selph.`,
  },
  {
    title: "Create a Selph",
    target: `.onboarding-step-2`,
    content: `Give your Selph a descriptive name, e.g. "John the Professional" or "Cindy @ mycompany.com"`,
  },
  {
    title: "Create a Selph",
    target: `.onboarding-step-3`,
    content: `Next, add a short description to your selph.`,
  },
];

type DashboardLayoutProps = {
  children: ReactNode;
  label?: string;
  title?: string;
  backButton?: { label?: string; href: string };
  buttonRight?: ReactNode;
  path?: { name: string; href: string }[];
  headChildren?: ReactNode;
};

function DasboardLayout({
  children,
  label,
  title,
  backButton,
  buttonRight,
  path,
  headChildren,
}: DashboardLayoutProps) {
  useSandbox();
  
  useJoyrideStepAtomDevtools();
  const router = useRouter();
  const {
    data: user,
    refetch,
    isLoading: userIsLoading,
    error: userError,
  } = useUser();

  const { sidebar } = usePage();
  // const tour = useStore((store) => store.tour);
  // const setStepIndex = useStore((store) => store.setStepIndex);
  const [joyrideStep, setJoyrideStep] = useAtom(joyrideStepAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (user?.confirmed) {
      // TODO: ASK ABOUT THIS
      refetch();

      console.log('REFETCHING..')
    } else {
      refetch({});

      console.log('REFETCHING..')

    }
  }, [user?.confirmed]);

  return (
    <>
      <PageWithSidebar sidebar={<Sidebar></Sidebar>}>
        <Button
          position="sticky"
          top="10px"
          borderRadius="0px"
          left="0"
          onClick={sidebar.toggle}
        >
          <Icon
            icon={sidebar.isOpen ? faOutdent : faBars}
            type="font-awesome"
          ></Icon>
        </Button>
        <PageContent isFluid>
          {backButton && (
            <Button
              iconBefore={faLongArrowAltLeft}
              iconBeforeProps={{ type: "font-awesome" }}
              marginRight="minor-2"
              palette="dark"
              size="small"
              onClick={() => router.push(backButton.href)}
            >
              {backButton.label ?? "Back"}
            </Button>
          )}
          <Box
            display={{ default: "flex", mobile: "block" }}
            marginY="minor-10"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              <Heading fontFamily="'Oswald', sans-serif">
                {label ?? "Dashboard"}
              </Heading>
              {path && (
                <Breadcrumb fontSize="250" marginY="minor-5">
                  {path.map((breadCrumb, index) => (
                    <Breadcrumb.Item
                      isCurrent={index === path.length - 1}
                      key={breadCrumb.name}
                    >
                      <Link href={breadCrumb.href}>
                        <Breadcrumb.Link isCurrent={index === path.length - 1}>
                          {breadCrumb.name}
                        </Breadcrumb.Link>
                      </Link>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              )}
            </div>
            <div>{buttonRight}</div>
          </Box>
          {userIsLoading ? (
            <Spinner></Spinner>
          ) : userError ? (
            <p>Error fetching user.</p>
          ) : (
            <>
              {user && user?.confirmed && children}
              {user && !user?.confirmed && (
                <>
                  <ConfirmEmail></ConfirmEmail>
                </>
              )}

              {/* {localStorage.getItem("skipTour") !== "true" && (
                <Joyride
                  steps={JOYRIDE_STEPS}
                  run={true}
                  continuous={true}
                  stepIndex={joyrideStep}
                  styles={{
                    beaconInner: { background: "#007AFF" },
                    beaconOuter: {
                      background: "#007AFF50",
                      border: "2px solid #007AFF",
                    },
                    buttonNext: { background: "#000", color: "#fff" },
                    buttonBack: { color: "#000" },
                  }}
                  spotlightClicks={true}
                  disableOverlayClose={true}
                  showSkipButton={true}
                  callback={({ index, action, type }) => {
                    if (action === ACTIONS.SKIP) {
                      localStorage.setItem("skipTour", "true");
                    }

                    if (type === EVENTS.TOUR_END) {
                      localStorage.setItem("skipTour", "true");
                    }

                    if (type === EVENTS.STEP_AFTER) {
                      // Update state to advance the tour
                      setJoyrideStep(
                        index + (action === ACTIONS.PREV ? -1 : 1)
                      );
                    }
                  }}
                />
              )} */}
            </>
          )}
        </PageContent>
      </PageWithSidebar>
    </>
  );
}

export default DasboardLayout;
