import { z } from "zod";

export const appliedAsRecruiterSchema = z.object({
  userId: z.string(),
  approved: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

export const jobSchema = z.object({
  title: z.string().min(2, {}),
  description: z.string().min(2, {}),
  salary: z.number().min(1, {}),
  currencyType: z.enum(["USD", "EUR", "GBP", "NGN", "INR"]).default("USD"),
  experienceLevelId: z.string(),
  jobTypeId: z.string(),
  companyId: z.string(),
  jobLocationId: z.string(),
  skillIds: z.string(),
  deadline: z.string(),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
  approved: z.enum(["APPROVED", "REJECTED", "PENDING"]).default("PENDING"),
  approvedBy: z.string().optional().nullable(),
  approvedDate: z.string().optional().nullable(),
});

export const companySchema = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters",
  }),
  description: z
    .string()
    .min(2, {
      message: "Company description must be at least 2 characters",
    })
    .optional()
    .nullable(),
  website: z
    .string()
    .url({
      message: "Invalid website URL",
    })
    .optional()
    .nullable(),
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^\d{11}$/, {
      message: "Invalid phone number",
    })
    .optional()
    .nullable(),
  address: z
    .string()
    .min(2, {
      message: "Company address must be at least 2 characters",
    })
    .optional()
    .nullable(),
  logoUrl: z
    .string()
    .url({
      message: "Invalid logo URL",
    })
    .optional()
    .nullable(),
});

export const jobTypeSchema = z.object({
  value: z
    .string()
    .min(2, {})
    .transform((v) => v.toLowerCase()),
  label: z.string().min(2, {}),
  description: z.string().min(2, {}).optional().nullable(),
});

export const jobLocationSchema = z.object({
  value: z
    .string()
    .min(2, {})
    .transform((v) => v.toLowerCase()),
  label: z.string().min(2, {}),
  description: z.string().min(2, {}).optional().nullable(),
});

export const experienceLevelSchema = z.object({
  value: z
    .string()
    .min(2, {})
    .transform((v) => v.toLowerCase()),
  label: z.string().min(2, {}),
  description: z.string().min(2, {}).optional().nullable(),
});

export const skillSchema = z.object({
  value: z
    .string()
    .min(2, {})
    .transform((v) => v.toLowerCase()),
  label: z.string().min(2, {}),
});
