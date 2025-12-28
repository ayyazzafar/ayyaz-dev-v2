/**
 * ExperienceDto - Response DTO for a work experience entry
 */
export class ExperienceDto {
  /** Experience ID */
  id: string;

  /** Company name */
  company: string;

  /** Job role/title */
  role: string;

  /** Role description */
  description: string | null;

  /** Start date */
  startDate: Date;

  /** End date (null if current position) */
  endDate: Date | null;

  /** Is this the current position? */
  current: boolean;

  /** Display order (lower = first) */
  order: number;
}
