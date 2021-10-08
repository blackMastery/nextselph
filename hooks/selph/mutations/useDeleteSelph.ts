import React from "react";
import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface DeleteSelphData {
  id: number;
}

interface UseDeleteSelphProps {
  onSuccess?: (data: any) => any;
}

function useDeleteSelph({ onSuccess }: UseDeleteSelphProps) {
  return useMutation(
    ({ id }: DeleteSelphData) => httpClient.delete(`/selph/${id}`),
    { onSuccess }
  );
}

export default useDeleteSelph;
