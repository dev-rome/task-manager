// src/lib/validation.ts
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id: string): boolean {
  return UUID_RE.test(id);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const ALLOWED_PRIORITIES = ["low", "medium", "high"];
const ALLOWED_STATUSES = ["todo", "in_progress", "done"];

export function isValidPriority(value: unknown): boolean {
  return typeof value === "string" && ALLOWED_PRIORITIES.includes(value);
}

export function isValidStatus(value: unknown): boolean {
  return typeof value === "string" && ALLOWED_STATUSES.includes(value);
}
