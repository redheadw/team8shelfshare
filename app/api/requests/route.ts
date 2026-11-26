import {
  BorrowRequestError,
  createBorrowRequest,
  getRequestsByBorrower,
} from "@/lib/borrow-requests";
import { getCurrentUserId } from "@/lib/current-user";
import type { NewBorrowRequest } from "@/lib/types";
import {
  earliestServerStartDate,
  validateBorrowRequest,
} from "@/lib/validate-borrow-request";

// 401: nobody is signed in, so we don't know whose requests these are.
function signInRequired() {
  return Response.json(
    { error: "Please sign in to borrow items." },
    { status: 401 },
  );
}

// GET /api/requests → the signed-in user's borrow requests (newest first)
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return signInRequired();

    const requests = await getRequestsByBorrower(userId);
    return Response.json(requests);
  } catch (error) {
    console.error("GET /api/requests failed:", error);
    return Response.json(
      { error: "Unable to load your requests." },
      { status: 500 },
    );
  }
}

// POST /api/requests → create a pending borrow request
// Body: { itemId, startDate, dueDate, message? }
export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return signInRequired();

  let body: Partial<Record<keyof NewBorrowRequest, unknown>>;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  // 400: the form data itself is wrong (missing item, bad dates, ...)
  // The server clock is UTC, so allow one day of slack for users' time zones.
  const fieldErrors = validateBorrowRequest(
    body ?? {},
    earliestServerStartDate(),
  );
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    const created = await createBorrowRequest(userId, body as NewBorrowRequest);
    // 201 Created: a new row now exists in borrow_requests
    return Response.json(created, { status: 201 });
  } catch (error) {
    // 404 / 409 / 422: valid form, but this item can't be borrowed right now
    if (error instanceof BorrowRequestError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/requests failed:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
