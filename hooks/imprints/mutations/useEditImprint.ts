import { useMutation } from "react-query";
import { mimeToExt } from "utils/getRecorderExt";
import { httpClient } from "utils/httpClient";

interface EditImprintProps {
  onSuccess?: (any: any) => any;
}

type ImprintUpdateData = {
  id: number;
  type?: string;
  prompt?: string;
  transcript?: string;
  recordedChunks?: any[];
  published?: boolean;
  reviewed?: boolean;
};

function useEditImprint({ onSuccess }: EditImprintProps) {
  return useMutation(
    (imprint: ImprintUpdateData) => {
      const formData = new FormData();
      imprint?.type && formData.append("type", imprint.type);
      imprint?.prompt && formData.append("prompt", imprint.prompt);
      imprint?.transcript && formData.append("transcript", imprint.transcript);
      imprint.published !== undefined &&
        formData.append("published", imprint.published?.toString());
      imprint.reviewed !== undefined &&
        formData.append("reviewed", imprint.reviewed?.toString());

      if (imprint?.recordedChunks?.length) {
        const blob = new Blob(imprint.recordedChunks, {
          type: imprint.recordedChunks[0].type,
        });

        if (imprint?.recordedChunks[0]?.ext) {
          Object.assign(blob, { ext: imprint.recordedChunks[0].ext });
        }

        const blobExt = !!blob["ext"] ? blob["ext"] : mimeToExt(blob.type);

        formData.append("sequence", blob, `imprint.${blobExt}`);
      }

      return httpClient.patch(`/imprint/${imprint.id}`, formData);
    },
    { onSuccess }
  );
}

export default useEditImprint;
