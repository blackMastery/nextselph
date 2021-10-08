import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";

interface EditSelphData {
  selphId: number;
  name?: string;
  description?: string;
}

interface EditSelphsProps {
  onSuccess?: (any: any) => any;
}

function useEditSelph({ onSuccess }: EditSelphsProps) {
  return useMutation(
    (data: EditSelphData) => httpClient.patch(`/selph/${data.selphId}`, data),
    { onSuccess }
  );
}

export default useEditSelph;
