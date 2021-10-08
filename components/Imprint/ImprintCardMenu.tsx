import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { Clickable, DropdownMenu, Tag } from "bumbag";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import DeleteImprint from "./DeleteImprint";
import PublishImprint from "./PublishImprint";

type ImprintDetails = {
  uniqueId: string;
  prompt: string;
  transcript: string;
  imprintId: number;
  type: string;
  reviewed: boolean;
};

type ImprintCardMenuProps = {
  imprintDetails: ImprintDetails;
};

function ImprintCardMenu({
  imprintDetails: { imprintId, reviewed },
}: ImprintCardMenuProps) {
  const {
    query: { selphId },
  } = useRouter();

  return (
    <div>
      <DropdownMenu
        menu={
          <React.Fragment>
            {reviewed ? (
              <>
                {" "}
                <PublishImprint id={imprintId}></PublishImprint>
                <Link
                  href={`/dashboard/selph/${selphId}/imprint/${imprintId}/edit`}
                >
                  <DropdownMenu.Item
                    iconBefore={faFileSignature}
                    iconBeforeProps={{ type: "font-awesome" }}
                  >
                    Edit
                  </DropdownMenu.Item>
                </Link>
              </>
            ) : (
              <Link
                href={{
                  pathname: `/dashboard/selph/[selphId]/imprint/[imprintId]/edit`,
                  query: { selphId, imprintId },
                }}
              >
                <DropdownMenu.Item
                  iconBefore={faFileSignature}
                  iconBeforeProps={{ type: "font-awesome" }}
                >
                  Review Transcript
                </DropdownMenu.Item>
              </Link>
            )}
            <DeleteImprint id={imprintId}></DeleteImprint>
          </React.Fragment>
        }
      >
        <Clickable
          //@ts-ignore
          use={(props) => <Tag size="small" {...props}></Tag>}
          borderRadius="0"
          cursor="pointer"
          transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
          _hover={{
            transform: "scale(1.12)",
            backgroundColor: "warning",
          }}
        >
          Manage
        </Clickable>
      </DropdownMenu>
    </div>
  );
}

export default ImprintCardMenu;
