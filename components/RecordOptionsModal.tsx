import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Clickable,
  Dialog,
  FieldStack,
  Icon,
  Modal,
  SelectField,
  Tooltip,
} from "bumbag";
import React, { Dispatch, ReactElement, SetStateAction } from "react";

interface Props {
  videoDeviceOptions: any[];
  audioDeviceOptions: any[];
  setVideoSource: Dispatch<SetStateAction<any>>;
  setAudioSource: Dispatch<SetStateAction<any>>;
}

function RecordOptionsModal({
  audioDeviceOptions,
  videoDeviceOptions,
  setAudioSource,
  setVideoSource,
}: Props): ReactElement {
  return (
    <div>
      <Modal.State>
        <Dialog.Modal baseId="record" title="Configure Recorder">
          <FieldStack>
            <SelectField
              label="Choose Camera Source"
              options={videoDeviceOptions}
              value={localStorage.getItem("videoSource")}
              onChange={(e) => {
                setVideoSource(e.target.value);
                localStorage.setItem("videoSource", e.target.value);
              }}
            />
            <SelectField
              label="Choose Audio Source"
              value={localStorage.getItem("audioSource")}
              options={audioDeviceOptions}
              onChange={(e) => {
                setAudioSource(e.target.value);
                localStorage.setItem("audioSource", e.target.value);
              }}
            />
          </FieldStack>
        </Dialog.Modal>
        <Modal.Disclosure
          // @ts-ignore
          use={(props) => (
            <Clickable
              {...props}
              position="absolute"
              top="10%"
              right="5%"
              zIndex="100"
              cursor="pointer"
            >
              <Tooltip content="Options">
                <Icon
                  fontSize="400"
                  color="#EBEBEA"
                  icon={faBars}
                  type="font-awesome"
                  _hover={{ color: "#C3C3C1" }}
                ></Icon>
              </Tooltip>
            </Clickable>
          )}
        >
          <Icon type="font-awesome"></Icon>
        </Modal.Disclosure>
      </Modal.State>
    </div>
  );
}

export default RecordOptionsModal;
