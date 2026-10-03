import { z } from "zod";

export const analyticsRangeSchema = z.enum(["7d", "30d", "90d"]);

export const analyticsInputSchema = z.object({
  userId: z.string().min(1),
  range: analyticsRangeSchema.optional(),
  since: z.string().optional(),
});

export type AnalyticsInput = z.infer<typeof analyticsInputSchema>;
