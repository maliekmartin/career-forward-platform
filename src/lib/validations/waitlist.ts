import { z } from "zod";

// US Regions for the dropdown
export const US_REGIONS = [
  { value: "northwest", label: "Northwest (WA, OR, ID, MT, AK)" },
  { value: "southwest", label: "Southwest (CA, NV, AZ, NM, HI)" },
  { value: "midwest", label: "Midwest (IL, OH, MI, WI, MN, IN, IA)" },
  { value: "northeast", label: "Northeast (NY, MA, PA, NJ, CT, NH, VT, ME, RI)" },
  { value: "southeast", label: "Southeast (FL, GA, NC, SC, VA, TN, AL, KY)" },
  { value: "south", label: "South (TX, OK, LA, AR, MS)" },
  { value: "mountain", label: "Mountain (CO, UT, WY, ND, SD, NE, KS, MO)" },
] as const;

export const regionValues = US_REGIONS.map((r) => r.value);

export const waitlistSchema = z.object({
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
  region: z
    .string()
    .min(1, "Please select your region"),
  referredBy: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
