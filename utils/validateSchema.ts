import { ZodType } from "zod";

export default function validateSchema(values: any, schema: ZodType<any, any>) {
  if (!schema) return;
  try {
    schema.parse(values);
  } catch (error) {
    return error.formErrors.fieldErrors;
  }
}
