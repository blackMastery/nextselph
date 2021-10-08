import { Box, Columns } from "bumbag";
import React from "react";
import useUser from "../../hooks/useUser";
import SelphCard from "./SelphCard";
import Link from "next/link";
import Cell from "../Cell";
import useSelphs from "@/hooks/selph/queries/useSelphs";

function SelphCardList() {
  const { data: user } = useUser();

  const {
    data: selphs,
    isLoading: selphsIsLoading,
    isError: isSelphsError,
    isSuccess: isSelphsSuccess,
  } = useSelphs({ query: { "user.id": user.id } });
  return (
    <>
      <Cell
        isError={isSelphsError}
        isLoading={selphsIsLoading}
        isSuccess={isSelphsSuccess}
        errorFallback={<p>Unable to fetch Selphs.</p>}
      >
        <Columns>
          {selphs?.map((selph) => (
            <Columns.Column spread={4} key={selph.id}>
              <Link
                href={{
                  pathname: "/dashboard/selph/[selphId]",
                  query: { selphId: selph.id || "" },
                }}
              >
                <Box>
                  <SelphCard
                    name={selph.name}
                    description={selph.description}
                    status={selph.published}
                    thumbnail={selph.thumbnail}
                  ></SelphCard>
                </Box>
              </Link>
            </Columns.Column>
          ))}
        </Columns>
      </Cell>
    </>
  );
}

export default SelphCardList;
