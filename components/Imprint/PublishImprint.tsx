import useImprint from "@/hooks/imprints/queries/useImprint";
import usePublishImprint from "@/hooks/imprints/mutations/usePublishImprint";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, useToasts } from "bumbag";
import { useRouter } from "next/router";
import React from "react";
import { useQueryClient } from "react-query";

function PublishImprint({ id }) {
  const toasts = useToasts();
  const router = useRouter();

  const { selphId } = router.query;
  const { data: imprint } = useImprint({ imprintId: id });
  const queryClient = useQueryClient();

  const { publishImprint } = usePublishImprint({
    onSuccess: () => {
      queryClient.invalidateQueries(["imprints", { selphId: Number(selphId) }]);
      toasts.success({
        title: `Imprint ${imprint?.published ? "Unpublished" : "Published"}`,
        message: `You imprint was ${
          imprint?.published ? "unpublished" : "published"
        } successfully.`,
      });
    },
  });

  return (
    <div>
      <DropdownMenu.Item
        iconBefore={faPowerOff}
        iconBeforeProps={{ type: "font-awesome" }}
        onClick={() => {
          publishImprint({ id, published: !imprint.published });
        }}
      >
        {imprint?.published ? "Unpublish" : "Publish"}
      </DropdownMenu.Item>
    </div>
  );
}

export default PublishImprint;
