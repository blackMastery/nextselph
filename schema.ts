import * as z from "zod";

const PASSWORD_LENGTH = 8;

const password = z.string().min(PASSWORD_LENGTH);

export const LoginSchema = z.object({
  email: z.string().email(),
  password,
});

export const SignUpSchema = z.object({
  email: z.string().email(),
  password,
});

export const SelphSchema = z.object({
  name: z
    .string()
    .min(4, "Name is too short (should have at least 4 characters)"),
  description: z
    .string()
    .min(10, "Description is too short (should have at least 10 characters)")
    .max(300),
});

export const ImprintSchema = z.object({
  prompt: z.string().min(2),
  type: z.enum(["idle", "greeting", "confused", "interaction"]),
  transcript: z.string().optional(),
  thumbnail: z.string().optional(),
  sequence: z
    .array(z.any())
    .refine((data) => data.length > 0, { message: "Sequence is required." })
    .refine(
      (data) => {
        if (data.length > 0) {
          const blob = data[0];
          console.log({ blobData: blob });
          return blob?.duration ? blob?.duration <= 100000 : true;
        }
      },
      { message: "Video must not be longer than 100000 seconds." }
    ),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ChangePasswordSchema = z.object({
  password,
});

export const UpdatePasswordSchema = z
  .object({
    newPassword: z.string().min(PASSWORD_LENGTH),
    confirmPassword: z.string(),
    currentPassword: z.string().min(PASSWORD_LENGTH),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "\nPasswords do not match.",
      path: ["confirmPassword"],
    }
  );

export const CreatePasswordSchema = UpdatePasswordSchema.omit({
  currentPassword: true,
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(PASSWORD_LENGTH),
    confirmNewPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: "\nPasswords do not match.",
      path: ["confirmPassword"],
    }
  );
