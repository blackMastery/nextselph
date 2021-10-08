import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Clickable,
  DropdownMenu,
  Popover,
  Tag,
  useToasts,
  Icon,
  Dialog,
  Modal,
} from "bumbag";
import React from "react";
import { useQueryClient } from "react-query";
import useDeleteImprint from "../../hooks/imprints/mutations/useDeleteImprint";

const DeleteButton = (props) => {
  return (
    <Clickable
      {...props}
      use={Tag}
      borderRadius="0"
      size="small"
      paddingX="0px"
      cursor="pointer"
      backgroundColor="danger"
      transition="all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
      _hover={{
        transform: "scale(1.12)",
        backgroundColor: "danger",
      }}
    >
      <Icon marginX="0" icon={faTrash} type="font-awesome"></Icon>
    </Clickable>
  );
};

function DeleteImprint({ id }: { id: number | string }) {
  const queryClient = useQueryClient();
  const { mutate: deleteImprint, isLoading: deleteImprintIsLoading } =
    useDeleteImprint({
      onSuccess: async ({ data }) => {
        toasts.success({
          title: "Imprint deleted.",
          message: "Your imprint was deleted.",
        });
        await queryClient.invalidateQueries([
          "imprints",
          { selphId: Number(data?.selphId) },
        ]);
      },
    });
  // const editImprintMode = useStore(store => store.editImprintMode)
  // const deleteSelphImprint = useStore(store => store.deleteSelphImprint)

  const toasts = useToasts();
  return (
    <div>
      <Modal.State>
        <Dialog.Modal
          showCloseButton={true}
          baseId={"delete-imprint-" + id}
          showActionButtons
          title="Delete Imprint"
          actionButtonsProps={{
            submitText: "Yes",
            cancelText: "No",
            isLoading: deleteImprintIsLoading,
            submitProps: { type: "button" },
            onClickSubmit: () => {
              deleteImprint({ id: Number(id) });
            },
          }}
        >
          Are you sure you want to delete this imprint?
        </Dialog.Modal>
        <Modal.Disclosure
          //@ts-ignore
          use={(props) => (
            <DropdownMenu.Item
              iconBefore={faTrash}
              color="danger"
              iconBeforeProps={{ type: "font-awesome" }}
              {...props}
              hideOnClick={false}
            >
              Delete
            </DropdownMenu.Item>
          )}
        >
          Open modal
        </Modal.Disclosure>
      </Modal.State>
    </div>
  );
}

export default DeleteImprint;
