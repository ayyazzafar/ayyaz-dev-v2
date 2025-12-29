import { z } from "zod";

/**
 * Check if a field name looks like a date field
 */
function isDateField(fieldName: string): boolean {
  const dateFieldPatterns = ["At", "Date", "date", "On", "Time"];
  return dateFieldPatterns.some(pattern => fieldName.includes(pattern));
}

