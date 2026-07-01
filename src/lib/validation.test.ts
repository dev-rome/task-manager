import { describe, test, expect } from "vitest";
import {
  isValidUuid,
  normalizeEmail,
  isValidPriority,
  isValidStatus,
} from "./validation";

describe("isValidUuid", () => {
  test("returns true for a valid UUID", () => {
    expect(isValidUuid("94437ed9-5775-43b3-a26d-04b1aee9ce49")).toBe(true);
  });
  test("returns false for a invalid UUID string", () => {
    expect(isValidUuid("not-a-uuid")).toBe(false);
  });
  test("returns false for a empty string", () => {
    expect(isValidUuid("")).toBe(false);
  });
  test("returns true for an uppercase UUID", () => {
    expect(isValidUuid("94437ED9-5775-43B3-A26D-04B1AEE9CE49")).toBe(true);
  });
  test("returns false for a UUID with wrong format", () => {
    expect(isValidUuid("94437ed9-5775-43b3-a26d")).toBe(false);
  });
});

describe("normalizeEmail", () => {
  test("converts email to lowercase", () => {
    expect(normalizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
  });
  test("trims whitespaces", () => {
    expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
  });
  test("trims whitespace and converts the email to lowercase", () => {
    expect(normalizeEmail("  TEST@EXAMPLE.COM  ")).toBe("test@example.com");
  });
  test("clean input already unchanged", () => {
    expect(normalizeEmail("test@example.com")).toBe("test@example.com");
  });
});

describe("isValidPriority", () => {
  test("returns true for valid priorities", () => {
    expect(isValidPriority("low")).toBe(true);
    expect(isValidPriority("medium")).toBe(true);
    expect(isValidPriority("high")).toBe(true);
  });
  test("returns false for an invalid priority string", () => {
    expect(isValidPriority("urgent")).toBe(false);
  });
  test("returns false for a non-string value", () => {
    expect(isValidPriority(42)).toBe(false);
    expect(isValidPriority(null)).toBe(false);
    expect(isValidPriority(undefined)).toBe(false);
  });
});

describe("isValidStatus", () => {
  test("returns true for valid statuses", () => {
    expect(isValidStatus("todo")).toBe(true);
    expect(isValidStatus("in_progress")).toBe(true);
    expect(isValidStatus("done")).toBe(true);
  });
  test("returns false for an invalid status string", () => {
    expect(isValidStatus("archived")).toBe(false);
  });
  test("returns false for a non-string value", () => {
    expect(isValidStatus(42)).toBe(false);
    expect(isValidStatus(null)).toBe(false);
  });
});
