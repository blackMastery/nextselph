import { Spinner } from "bumbag";
import React, { ReactNode } from "react";

type CellProps = {
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
  errorFallback: ReactNode;
  isSuccess: boolean;
};

function Cell({
  children,
  isLoading,
  errorFallback,
  isSuccess,
  isError = false,
}: CellProps) {
  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError && !isSuccess) {
    return <>{errorFallback}</>;
  }

  return <>{isSuccess && children}</>;
}

export default Cell;
