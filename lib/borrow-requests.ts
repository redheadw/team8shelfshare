import "server-only";
import { sql } from "./db";
import type {
  BorrowRequest,
  BorrowRequestWithItem,
  ItemOption,
  NewBorrowRequest,
} from "./types";

// Columns every request query returns, renamed from snake_case to camelCase.
const REQUEST_COLUMNS = sql.unsafe(`
  r.id,
  r.item_id                         AS "itemId",
  r.borrower_id                     AS "borrowerId",
  to_char(r.start_date, 'YYYY-MM-DD') AS "startDate",
  to_char(r.due_date, 'YYYY-MM-DD')   AS "dueDate",
  r.message,
  r.status,
  r.created_at                      AS "createdAt"
`);

// The reasons a request can be refused even when the form is filled in correctly.
export class BorrowRequestError extends Error {
  constructor(
    message: string,
    public readonly status: 404 | 409 | 422,
  ) {
    super(message);
    this.name = "BorrowRequestError";
  }
}

/** Items the user could ask to borrow: available, not deleted, not their own. */
export async function getBorrowableItems(
  userId: string,
): Promise<ItemOption[]> {
  const rows = await sql`
    SELECT i.id, i.title, u.name AS "ownerName"
    FROM items i
    JOIN users u ON u.id = i.owner_id
    WHERE i.is_available
      AND i.deleted_at IS NULL
      AND i.owner_id <> ${userId}
    ORDER BY i.title
  `;
  return rows as ItemOption[];
}

/** Requests the user has sent, newest first, with item and owner names. */
export async function getRequestsByBorrower(
  borrowerId: string,
): Promise<BorrowRequestWithItem[]> {
  const rows = await sql`
    SELECT ${REQUEST_COLUMNS}, i.title AS "itemTitle", u.name AS "ownerName"
    FROM borrow_requests r
    JOIN items i ON i.id = r.item_id
    JOIN users u ON u.id = i.owner_id
    WHERE r.borrower_id = ${borrowerId}
    ORDER BY r.created_at DESC
  `;
  return rows as BorrowRequestWithItem[];
}

/**
 * Saves a new pending request after checking the item can be borrowed.
 * Throws BorrowRequestError with an HTTP status when it can't.
 */
export async function createBorrowRequest(
  borrowerId: string,
  input: NewBorrowRequest,
): Promise<BorrowRequest> {
  const [item] = await sql`
    SELECT owner_id AS "ownerId", is_available AS "isAvailable"
    FROM items
    WHERE id = ${input.itemId} AND deleted_at IS NULL
  `;

  if (!item) {
    throw new BorrowRequestError("That item no longer exists.", 404);
  }
  if (item.ownerId === borrowerId) {
    throw new BorrowRequestError("You can't borrow your own item.", 422);
  }
  if (!item.isAvailable) {
    throw new BorrowRequestError("That item is currently lent out.", 409);
  }

  const [existing] = await sql`
    SELECT 1 FROM borrow_requests
    WHERE item_id = ${input.itemId}
      AND borrower_id = ${borrowerId}
      AND status = 'pending'
  `;
  if (existing) {
    throw new BorrowRequestError(
      "You already have a pending request for this item.",
      409,
    );
  }

  const [created] = await sql`
    INSERT INTO borrow_requests AS r (item_id, borrower_id, start_date, due_date, message)
    VALUES (
      ${input.itemId},
      ${borrowerId},
      ${input.startDate},
      ${input.dueDate},
      ${input.message?.trim() || null}
    )
    RETURNING ${REQUEST_COLUMNS}
  `;
  return created as BorrowRequest;
}
