import useEditImprint from "./useEditImprint";
import { httpClient } from "../../../utils/httpClient";
import { useMutation } from "react-query";

type PublishImprintProps = {
  onSuccess?: () => any;
};

type PublishImprintData = {
  id: number;
  published: boolean;
};

function usePublishImprint({ onSuccess }: PublishImprintProps) {
  const { mutate: publishImprint } = useMutation(
    ({ published, id }: PublishImprintData) => {
      return httpClient.get(
        `/imprint/${id}/${published ? "publish" : "unpublish"}`
      );
    },
    { onSuccess }
  );

  return { publishImprint };
}

export default usePublishImprint;
