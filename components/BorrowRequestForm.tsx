"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { FieldErrors, ItemOption } from "@/lib/types";
import {
  MAX_MESSAGE_LENGTH,
  toDateString,
  validateBorrowRequest,
} from "@/lib/validate-borrow-request";

interface BorrowRequestFormProps {
  items: ItemOption[];
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const inputClasses =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 aria-invalid:border-red-700";

export default function BorrowRequestForm({ items }: BorrowRequestFormProps) {
  const router = useRouter();
  const [itemId, setItemId] = useState(items.length === 1 ? items[0].id : "");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const today = toDateString(new Date());
  const isSubmitting = status.kind === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Check in the browser first for instant feedback.
    const errors = validateBorrowRequest({
      itemId,
      startDate,
      dueDate,
      message,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({
        kind: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    // 2. Send it to the API route, which checks again and saves it.
    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, startDate, dueDate, message }),
      });
      const data: { error?: string; fieldErrors?: FieldErrors } =
        await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setStatus({
          kind: "error",
          message: data.error ?? "Your request could not be sent.",
        });
        return;
      }

      // 3. Success: clear the form and refresh the server-rendered list.
      const itemTitle = items.find((item) => item.id === itemId)?.title;
      setItemId(items.length === 1 ? items[0].id : "");
      setStartDate("");
      setDueDate("");
      setMessage("");
      setStatus({
        kind: "success",
        message: `Request sent! We'll let you know when the owner of the ${itemTitle ?? "item"} replies.`,
      });
      router.refresh();
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-stone-600">
        There are no items available to borrow right now.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Item — hidden when the form is used for a single item */}
      {items.length > 1 && (
        <div>
          <label htmlFor="itemId" className="mb-1 block font-medium">
            Item
          </label>
          <select
            id="itemId"
            value={itemId}
            onChange={(event) => setItemId(event.target.value)}
            aria-invalid={Boolean(fieldErrors.itemId)}
            aria-describedby={fieldErrors.itemId ? "itemId-error" : undefined}
            className={inputClasses}
          >
            <option value="">Choose an item…</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} (lent by {item.ownerName})
              </option>
            ))}
          </select>
          <FieldError id="itemId-error" message={fieldErrors.itemId} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-1 block font-medium">
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            aria-invalid={Boolean(fieldErrors.startDate)}
            aria-describedby={
              fieldErrors.startDate ? "startDate-error" : undefined
            }
            className={inputClasses}
          />
          <FieldError id="startDate-error" message={fieldErrors.startDate} />
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block font-medium">
            Return date
          </label>
          <input
            id="dueDate"
            type="date"
            min={startDate || today}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-invalid={Boolean(fieldErrors.dueDate)}
            aria-describedby={fieldErrors.dueDate ? "dueDate-error" : undefined}
            className={inputClasses}
          />
          <FieldError id="dueDate-error" message={fieldErrors.dueDate} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block font-medium">
          Message to the owner{" "}
          <span className="text-stone-600">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          maxLength={MAX_MESSAGE_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={inputClasses}
          placeholder="e.g. I need it for a weekend camping trip."
        />
        <FieldError id="message-error" message={fieldErrors.message} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending request…" : "Request to borrow"}
      </button>

      {/* Screen readers announce changes inside an aria-live region. */}
      <div aria-live="polite" role="status">
        {status.kind === "success" && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-green-700">
            {status.message}
          </p>
        )}
        {status.kind === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-700">
      {message}
    </p>
  );
}
