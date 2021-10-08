import { FieldStack, InputField, TextareaField } from "bumbag";
import { Field, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { JOYRIDE_STEPS } from "../../layouts/dashboard-layout";

function SelphForm() {
  return (
    <FieldStack>
      <Field
        component={InputField.Formik}
        //@ts-ignore
        className={JOYRIDE_STEPS[1].target.slice(1)}
        name="name"
        label="Name"
        isRequired
      ></Field>
      <Field
        component={TextareaField.Formik}
        //@ts-ignore
        className={JOYRIDE_STEPS[2].target.slice(1)}
        name="description"
        label="Description"
        isRequired
      ></Field>
    </FieldStack>
  );
}

export default SelphForm;
