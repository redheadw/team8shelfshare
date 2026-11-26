import type { FieldErrors, NewBorrowRequest } from "./types";

// Shared by the form (instant feedback in the browser) and the API route
// (the real check — browser checks can always be skipped by a direct request).

export const MAX_LOAN_DAYS = 30;
export const MAX_MESSAGE_LENGTH = 500;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// "YYYY-MM-DD" for a Date, using the local calendar day.
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isRealDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  // Rejects impossible dates like 2026-02-31, which Date would roll over.
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function daysBetween(start: string, end: string): number {
  return (
    (new Date(`${end}T00:00:00Z`).getTime() -
      new Date(`${start}T00:00:00Z`).getTime()) /
    DAY_IN_MS
  );
}

/**
 * The earliest start date the server accepts: yesterday by the server's clock.
 * The server runs on UTC, which is already "tomorrow" for users in the
 * Americas in the evening, so one day of slack keeps "today" valid everywhere.
 */
export function earliestServerStartDate(now: Date = new Date()): string {
  return toDateString(new Date(now.getTime() - DAY_IN_MS));
}

/**
 * Checks a borrow request and returns an error message per invalid field.
 * An empty object means the request is valid. `earliestStartDate` defaults to
 * the local "today" (right for the browser); the server passes
 * earliestServerStartDate() instead.
 */
export function validateBorrowRequest(
  input: Partial<Record<keyof NewBorrowRequest, unknown>>,
  earliestStartDate: string = toDateString(new Date()),
): FieldErrors {
  const errors: FieldErrors = {};
  const { itemId, startDate, dueDate, message } = input;

  if (typeof itemId !== "string" || !UUID_PATTERN.test(itemId)) {
    errors.itemId = "Choose an item to borrow.";
  }

  if (typeof startDate !== "string" || !isRealDate(startDate)) {
    errors.startDate = "Enter a valid start date.";
  } else if (startDate < earliestStartDate) {
    errors.startDate = "Start date can't be in the past.";
  }

  if (typeof dueDate !== "string" || !isRealDate(dueDate)) {
    errors.dueDate = "Enter a valid return date.";
  } else if (typeof startDate === "string" && isRealDate(startDate)) {
    const days = daysBetween(startDate, dueDate);
    if (days < 0) {
      errors.dueDate = "Return date must be on or after the start date.";
    } else if (days > MAX_LOAN_DAYS) {
      errors.dueDate = `Loans can last up to ${MAX_LOAN_DAYS} days.`;
    }
  }

  if (message !== undefined && message !== null) {
    if (typeof message !== "string") {
      errors.message = "Message must be text.";
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Keep your message under ${MAX_MESSAGE_LENGTH} characters.`;
    }
  }

  return errors;
}
