import { isMatch } from "date-fns";
import { string, z } from "zod";

export const generateAIReportSchema = z.object({
  month: string().refine((value) => isMatch(value, "MM")),
});

export type GenerateAIReportSchema = z.infer<typeof generateAIReportSchema>;
