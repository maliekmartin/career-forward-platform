import { z } from "zod";

export const pricingLeadSchema = z.object({
  leadType: z.enum(["coach", "organization"]),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  organization: z.string().optional(),
  phone: z.string().optional(),
  teamSize: z.number().int().min(1).max(1000).optional(),
  coachCount: z.number().int().min(1).max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export type PricingLeadInput = z.infer<typeof pricingLeadSchema>;
