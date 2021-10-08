import { useMutation } from "react-query";
import { httpClient } from "utils/httpClient";
import localForage from "localforage";
import { mimeToExt } from "utils/getRecorderExt";

export interface ImprintData {
  selph: number;
  type: string;
  blobId?: string;
  blob?: Blob;
  prompt?: string;
  transcript?: string;
  description?: string;
  thumbnail?: string;
}

interface UseCreateImprintProps {
  onSuccess?: (data: any) => any;
}

function useCreateImprint({ onSuccess }: UseCreateImprintProps) {
  return useMutation(
    async (imprint: ImprintData) => {
      const {
        type,
        description,
        transcript,
        prompt,
        selph,
        blobId,
        blob: providedBlob,
        thumbnail,
      } = imprint;

      const blob: Blob = providedBlob
        ? providedBlob
        : await localForage.getItem("imprint_" + blobId);

      const formData = new FormData();
      if (selph) {
        formData.append("selphId", selph.toString());
        type && formData.append("type", type.toUpperCase());
        prompt && formData.append("prompt", prompt);
        transcript && formData.append("transcript", transcript);
        description && formData.append("description", description);
        formData.append("reviewed", "false");
      }

      let blobExt = !!blob["ext"] ? blob["ext"] : mimeToExt(blob.type);

      if (blob) {
        formData.append("sequence", blob, `imprint.${blobExt}`);
      }

      if (thumbnail) {
        const thumbnailBlob = await (await fetch(thumbnail)).blob();

        if (thumbnailBlob) {
          formData.append("thumbnail", thumbnailBlob, "thumb.png");
        }
      }

      const { data } = await httpClient.post("/imprint", formData);

      return data;
    },
    { onSuccess }
  );
}

export default useCreateImprint;
