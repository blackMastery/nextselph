import React, { useEffect } from "react";
import { Disclosure, Button, Stack, Dialog, Modal } from "bumbag";
import CodeBlock from "../CodeBlock";
import useCopyText from "@/hooks/useCopyText";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

interface SelphCodeDisclosureProps {
  selphHandle: string;
  disabled: boolean;
}

function SelphCodeDisclosure({
  selphHandle,
  disabled = false,
}: SelphCodeDisclosureProps) {
  const disclosure = Disclosure.useState();
  const { copied, copyText, setCopied } = useCopyText();
  const code =
    `<script type="text/javascript" data-id="tslphmbed" src="https://app.trueselph.com/embed/selph.embed.js" data-selphid="${selphHandle}"></script>`.trim();

  useEffect(() => {
    if (disabled) disclosure.setVisible(false);
  }, [disabled]);

  return (
    <>
      <Modal.State>
        <Dialog.Modal
          showCloseButton
          baseId={selphHandle}
          title="Embed your Selph"
          minWidth={700}
        >
          <Stack alignX="right">
            <CodeBlock language="jsx" code={code}></CodeBlock>
            <Button
              iconBefore={faClipboard}
              iconBeforeProps={{ type: "font-awesome" }}
              size="small"
              color="#fff"
              background="#000"
              disabled={copied}
              onClick={() =>
                copyText(code).then(() => {
                  setTimeout(() => setCopied(false), 3000);
                })
              }
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </Stack>
        </Dialog.Modal>
        <Modal.Disclosure use={Button} disabled={disabled}>
          Embed
        </Modal.Disclosure>
      </Modal.State>

      <Disclosure.Content {...disclosure}>
        {disabled ? (
          <></>
        ) : (
          <>
            <CodeBlock language="jsx" code={code}></CodeBlock>
          </>
        )}
      </Disclosure.Content>
    </>
  );
}

export default SelphCodeDisclosure;
