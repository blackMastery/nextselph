import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface DeleteImprintData {
  id: number;
}

interface UseDeleteImprintProps {
  onSuccess?: (data: any) => any;
}

function useDeleteImprint({ onSuccess }: UseDeleteImprintProps) {
  return useMutation(
    (imprint: DeleteImprintData) => httpClient.delete(`/imprint/${imprint.id}`),
    { onSuccess }
  );
}

export default useDeleteImprint;
