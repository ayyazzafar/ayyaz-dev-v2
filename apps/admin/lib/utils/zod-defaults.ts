import { z } from "zod";

/**
 * Maps an entity (API response) to form values using a Zod schema.
 *
 * Handles:
 * - null → "" (empty string for form inputs)
 * - ISO date strings → "YYYY-MM-DD" (for date inputs)
 * - Missing fields → schema defaults
 *
 * @example
 * const formValues = mapEntityToFormValues(
 *   projectsControllerCreateBody,
 *   existingProject  // ProjectDto from API
 * );
 * form.reset(formValues);
 */
export function mapEntityToFormValues<T extends z.ZodTypeAny, E extends object>(
  schema: T,
  entity: E | null | undefined
): z.infer<T> {
  const defaults = getZodDefaults(schema);

  if (!entity) {
    return defaults;
  }

  // Get the shape of the schema to know what fields to map
  const shape = (schema as unknown as { shape?: Record<string, z.ZodTypeAny> }).shape;

  if (!shape) {
    return defaults;
  }

  const result: Record<string, unknown> = { ...(defaults as object) };
  const entityRecord = entity as Record<string, unknown>;

  for (const key of Object.keys(shape)) {
    const value = entityRecord[key];

    if (value === null || value === undefined) {
      // Keep the default value
      continue;
    }

    // Handle date strings (ISO format → date input format)
    if (typeof value === "string" && value.includes("T") && isDateField(key)) {
      result[key] = value.split("T")[0];
    } else {
      result[key] = value;
    }
  }

  return result as z.infer<T>;
}

/**
 * Check if a field name looks like a date field
 */
function isDateField(fieldName: string): boolean {
  const dateFieldPatterns = ["At", "Date", "date", "On", "Time"];
  return dateFieldPatterns.some(pattern => fieldName.includes(pattern));
}

/**
 * Extracts default values from a Zod schema for use with react-hook-form.
 *
 * Works with Zod v4 by inspecting schema._zod.def.type
 *
 * Returns sensible defaults:
 * - string → ""
 * - number → 0
 * - boolean → false
 * - enum → first option
 * - array → []
 * - optional/nullable → recurses into inner type
 * - object → recursively processes all properties
 *
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number(),
 *   active: z.boolean(),
 *   status: z.enum(["ACTIVE", "INACTIVE"]),
 * });
 *
 * const defaults = getZodDefaults(schema);
 * // { name: "", age: 0, active: false, status: "ACTIVE" }
 */
export function getZodDefaults<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  // Access Zod v4 internal structure
  const zodDef = (schema as unknown as { _zod?: { def?: { type?: string; entries?: Record<string, string>; innerType?: unknown; schema?: unknown; defaultValue?: unknown } } })._zod?.def;
  const type = zodDef?.type;

  // Handle default values
  if (type === "default" && zodDef?.defaultValue !== undefined) {
    return zodDef.defaultValue as z.infer<T>;
  }

  // Handle object schemas
  if (type === "object") {
    const shape = (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape;
    if (shape) {
      return Object.fromEntries(
        Object.entries(shape).map(([key, value]) => [
          key,
          getZodDefaults(value as z.ZodTypeAny),
        ])
      ) as z.infer<T>;
    }
  }

  // Handle optional/nullable - get defaults from inner type
  if (type === "optional" || type === "nullable") {
    const innerType = zodDef?.innerType as z.ZodTypeAny | undefined;
    if (innerType) {
      return getZodDefaults(innerType) as z.infer<T>;
    }
  }

  // Handle primitives
  if (type === "string") return "" as z.infer<T>;
  if (type === "number" || type === "int") return 0 as z.infer<T>;
  if (type === "boolean") return false as z.infer<T>;

  // Handle enums - return first option
  if (type === "enum") {
    // Zod v4 uses 'entries' object instead of 'values' array
    const entries = zodDef?.entries as Record<string, string> | undefined;
    if (entries) {
      const firstValue = Object.values(entries)[0];
      if (firstValue !== undefined) {
        return firstValue as z.infer<T>;
      }
    }
  }

  // Handle arrays
  if (type === "array") return [] as z.infer<T>;

  // Handle effects/transforms
  if (type === "effect" || type === "transform") {
    const innerSchema = zodDef?.schema as z.ZodTypeAny | undefined;
    if (innerSchema) {
      return getZodDefaults(innerSchema) as z.infer<T>;
    }
  }

  // Fallback
  return undefined as z.infer<T>;
}
