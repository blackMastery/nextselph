import {
  Box,
  Card,
  Switch,
  Text,
  Divider,
  Heading,
  Columns,
  Button,
  Stack,
  useToasts,
  Popover,
} from "bumbag";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImprintCard from "../../../../components/Imprint/ImprintCard";
import useDeleteSelph from "../../../../hooks/selph/mutations/useDeleteSelph";
import DashboardLayout from "../../../../layouts/dashboard-layout";
import useImprints from "@/hooks/imprints/queries/useImprints";
import Cell from "components/Cell";
import usePublishSelph from "@/hooks/imprints/mutations/usePublishSelph";
import useUnpublishSelph from "@/hooks/imprints/mutations/useUnpublishSelph";
import useSelph from "@/hooks/selph/queries/useSelph";
import SelphCodeModal from "@/components/selph/SelphCodeModal";
import SelphPhotoControl from "components/selph/SelphPhotoControl";
import ShareSelphModal from "components/selph/ShareSelphModal";
import ImprintSearchBox from "components/Imprint/ImprintSearchBox";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AddImprintCard from "@/components/Imprint/AddImprintCard";
import Head from 'next/head'
import useUser from "@/hooks/useUser";

function ViewSelphPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(true);
  const { data: user, isLoading: loading } = useUser();
  console.log(user)

  const { selphId } = router.query;

  const [missingBaseType, setMissingBaseType] = useState("");

  const {
    data: selph,
    isLoading: selphIsLoading,
    isError: selphIsError,
    isSuccess: selphIsSuccess,
  } = useSelph({ selphId: Number(selphId), enabled: !!selphId });

  const {
    data: imprints,
    isLoading: imprintsIsLoading,
    isError: imprintsIsError,
    isSuccess: imprintsIsSuccess,
  } = useImprints({
    selphId: Number(selphId as string),
    enabled: parseInt(selphId as string) !== NaN,
    onSuccess: (imprintsRes) => {
      const baseImprintTypes = ["IDLE", "CONFUSED", "GREETING", "GOODBYE"];
      for (let type of baseImprintTypes) {
        const baseImprints = imprintsRes.filter((imp) => imp.type === type);
        if (!baseImprints.length) {
          setMissingBaseType(type);
          break;
        }
      }
    },
  });

  const { mutate: deleteSelph, isLoading: deleteSelphIsLoading } =
    useDeleteSelph({
      onSuccess: () => {
        toasts.success({
          title: "Selph Deleted!",
          message: "Your selph was deleted successfully.",
        });
        router.push("/dashboard/");
      },
    });

  const { mutate: publish } = usePublishSelph();
  const { mutate: unpublish } = useUnpublishSelph();

  useEffect(() => {
    if (selph) setChecked(selph.published);



  }, [selph]);

  const toasts = useToasts();

  const onDelete = async () => {
    deleteSelph({ id: Number(selphId) });
  };

  return (
    <>
    
      <DashboardLayout
        label="Build Your Selph"
        title="Build Your Selph"
        buttonRight={
          <>
            {!missingBaseType && selphIsSuccess && (
              <Box marginBottom="minor-4" display="flex" alignItems="center">
                <Switch
                  palette="dark"
                  marginRight="minor-4"
                  label="Published"
                  checked={checked}
                  onChange={(e: any) => {
                    setChecked(e.target?.checked);
                    // update selph status
                    if (e.target?.checked) {
                      // publish selph
                      publish({
                        selphId: Number(selphId),
                      });
                    }

                    if (!e.target.checked) {
                      // unpublish selph
                      unpublish({
                        selphId: Number(selphId),
                      });
                    }
                  }}
                />

                {selph.published && (
                  <Box display="flex">
                    <ShareSelphModal
                      disabled={!selph.published}
                      handle={selph.handle}
                    ></ShareSelphModal>
                    <Box marginX="minor-2"></Box>
                    <Box>
                      <SelphCodeModal
                        disabled={!selph.published}
                        selphHandle={selph.handle}
                      ></SelphCodeModal>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </>
        }
        path={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Build Your Selph", href: `#` },
        ]}
      >
        <Card>
          <Cell
            isError={selphIsError}
            errorFallback={<p>Error fetching selph.</p>}
            isLoading={selphIsLoading}
            isSuccess={selphIsSuccess}
          >
            {selph && (
              <Box>
              <Head>
              <meta property="og:description" content={selph.description} key="description" />
              <meta property="og:url"content={selph.thumbnail?.formats?.thumbnail?.url} key="url" />
              <meta property="og:title"   content={selph.name} key='title' />

              </Head>
                <Box
                  display={{ default: "flex", mobile: "block" }}
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    marginY={{ mobile: "minor-4" }}
                  >
                    <SelphPhotoControl
                      selphId={selph.id}
                      thumbnail={
                        selph.thumbnail
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${selph.thumbnail}`
                          : null
                      }
                    ></SelphPhotoControl>
                    <Box marginLeft="minor-2">
                      <Heading use="h3">{selph.name}</Heading>
                      <Text.Block color="grey">{selph.description}</Text.Block>
                    </Box>
                  </Box>
                  <Stack>
                    <Button
                      marginRight="minor-2"
                      palette="dark"
                      iconBefore={faPen}
                      iconBeforeProps={{ type: "font-awesome" }}
                      onClick={() =>
                        router.push({
                          pathname: "/dashboard/selph/[selphId]/edit",
                          query: { selphId },
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Popover.State>
                      <Popover.Disclosure
                        use={Button}
                        //@ts-ignore
                        iconBefore={faTrashAlt}
                        iconBeforeProps={{ type: "font-awesome" }}
                        color="danger"
                      >
                        Delete
                      </Popover.Disclosure>
                      <Popover
                        hasArrow
                        showActionButtons
                        actionButtonsProps={{
                          submitText: "Yes",
                          cancelText: "No",
                          submitProps: {
                            onClick: () => onDelete(),
                            isLoading: deleteSelphIsLoading,
                          },
                        }}
                      >
                        Are you sure?
                      </Popover>
                    </Popover.State>
                  </Stack>
                </Box>

                <Divider marginY="minor-4"></Divider>
                <Box
                  display={{ default: "flex", mobile: "block" }}
                  justifyContent="space-between"
                  alignItems="center"
                  marginY="minor-4"
                >
                  <Heading use="h4">Imprints</Heading>
                  <ImprintSearchBox></ImprintSearchBox>
                </Box>

                <Cell
                  isError={imprintsIsError}
                  isLoading={imprintsIsLoading}
                  isSuccess={imprintsIsSuccess}
                  errorFallback={<p>Error fetching imprints.</p>}
                >
                  <Columns>
                    <Columns.Column spread={4} spreadDesktop={6}>
                      <AddImprintCard type={missingBaseType} />
                    </Columns.Column>
                    {imprints?.map((imprint) => (
                      <Columns.Column
                        spread={4}
                        spreadDesktop={6}
                        key={imprint.id}
                      >
                        <ImprintCard
                          imprintDetails={{
                            reviewed: imprint.reviewed,
                            published: imprint.published,
                            publicUrl: "/file/" + imprint.sequence,
                            imprintId: imprint.id,
                            type: imprint.type,
                            transcript: imprint.transcript,
                            prompt: imprint.prompt,
                            captionUrl: imprint.caption?.url,
                            thumbnail: imprint?.thumbnail,
                            transcriptionStatus: imprint.transcription_status,
                          }}
                        ></ImprintCard>
                      </Columns.Column>
                    ))}
                  </Columns>
                </Cell>
              </Box>
            )}
          </Cell>
        </Card>
      </DashboardLayout>
    </>
  );
}

export default ViewSelphPage;
