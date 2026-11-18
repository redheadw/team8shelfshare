import type { Metadata } from "next";
import { Suspense } from "react";
import BorrowRequestForm from "@/components/BorrowRequestForm";
import StatusBadge from "@/components/StatusBadge";
import {
  getBorrowableItems,
  getRequestsByBorrower,
} from "@/lib/borrow-requests";
import { getCurrentUserId } from "@/lib/demo-user";

export const metadata: Metadata = {
  title: "My Borrow Requests | ShelfShare",
  description: "Request items from neighbors and track your borrow requests.",
};

// The page shell (headings) is sent right away; the two database-driven
// sections stream in when their queries finish (Cache Components + Suspense).
export default function RequestsPage() {
  return (
    // Explicit light background and text color: the starter globals.css still
    // switches to dark mode, which would hide dark text (theme is issue #11).
    <main className="flex-1 bg-stone-50 text-stone-900">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 md:py-12">
        <header>
          <h1 className="text-3xl font-extrabold text-stone-900 md:text-4xl">
            My Borrow Requests
          </h1>
          <p className="mt-2 text-stone-600">
            Ask a neighbor to borrow something, then track their reply here.
          </p>
        </header>

        <section
          aria-labelledby="new-request-heading"
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <h2
            id="new-request-heading"
            className="mb-4 text-2xl font-bold text-stone-900"
          >
            Request an item
          </h2>
          <Suspense fallback={<p className="text-stone-600">Loading items…</p>}>
            <NewRequest />
          </Suspense>
        </section>

        <section aria-labelledby="sent-requests-heading">
          <h2
            id="sent-requests-heading"
            className="mb-4 text-2xl font-bold text-stone-900"
          >
            Requests I&apos;ve sent
          </h2>
          <Suspense fallback={<RequestListSkeleton />}>
            <SentRequests />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

async function NewRequest() {
  const userId = await getCurrentUserId();
  const items = await getBorrowableItems(userId);
  return <BorrowRequestForm items={items} />;
}

async function SentRequests() {
  const userId = await getCurrentUserId();
  const requests = await getRequestsByBorrower(userId);

  if (requests.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-600">
        You haven&apos;t requested anything yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <li
          key={request.id}
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-900">
              {request.itemTitle}
            </h3>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-1 text-sm text-stone-600">
            Lent by {request.ownerName}
          </p>
          <p className="mt-3 text-sm text-stone-900">
            {formatDate(request.startDate)} – {formatDate(request.dueDate)}
          </p>
          {request.message && (
            <p className="mt-2 text-sm text-stone-600">
              &ldquo;{request.message}&rdquo;
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function RequestListSkeleton() {
  return (
    <div role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading your requests…</span>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="h-32 animate-pulse rounded-2xl border border-stone-200 bg-stone-100"
        />
      ))}
    </div>
  );
}

// "2026-11-21" → "Nov 21, 2026" (parsed as UTC so the day never shifts)
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
