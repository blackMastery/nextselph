import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "utils/httpClient";

interface UnpublishSelphData {
  selphId: number;
}

function useUnpublishSelph() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ selphId }: UnpublishSelphData) =>
      httpClient.get(`/selph/${selphId}/unpublish`),

    {
      onSuccess: (selph) => {
        queryClient.invalidateQueries([
          "selphs",
          { id: Number(selph?.data?.id) },
        ]);
      },
    }
  );
}

export default useUnpublishSelph;
