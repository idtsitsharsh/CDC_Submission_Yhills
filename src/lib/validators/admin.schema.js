import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
});
export const CreateAdminSchema = z.object({
  email: z
    .string()
    .email("Invalid admin email"),
  password: z
    .string()
    .min(6, "Admin password must be at least 6 characters"),
});
