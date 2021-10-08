import useCopyText from "@/hooks/useCopyText";
import { Button, Dialog, Group, Input, Modal } from "bumbag";
import React, { useState } from "react";

function ShareSelphModal({ handle, disabled = false }) {
  const { copied, copyText, setCopied } = useCopyText();
  const [link] = useState(`https://app.trueselph.com/selph/interact/${handle}`);

  return (
    <div>
      <Modal.State>
        <Dialog.Modal
          baseId={handle}
          title="Share your Selph"
          minWidth={700}
          showCloseButton
        >
          <Group>
            <Input width="100%" value={link} readOnly></Input>
            <Button
              onClick={() => {
                copyText(link);
                setTimeout(() => setCopied(false), 3000);
              }}
              disabled={copied}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </Group>
        </Dialog.Modal>
        <Modal.Disclosure use={Button} disabled={disabled}>
          Share
        </Modal.Disclosure>
      </Modal.State>
    </div>
  );
}

export default ShareSelphModal;
