import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "utils/httpClient";

interface PublishSelphData {
  selphId: number;
}

function usePublishSelph() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ selphId }: PublishSelphData) =>
      httpClient.get(`/selph/${selphId}/publish`),
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

export default usePublishSelph;
