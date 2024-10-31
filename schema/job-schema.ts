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
  name: z.string().min(2, {}),
  description: z.string().min(2, {}).optional().nullable(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
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
