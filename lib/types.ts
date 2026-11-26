// Shared ShelfShare types. Fields use camelCase; the database uses
// snake_case, and the SQL queries rename columns with AS "camelCase".

export type RequestStatus =
  "pending" | "approved" | "declined" | "returned" | "cancelled";

export interface BorrowRequest {
  id: string;
  itemId: string;
  borrowerId: string;
  startDate: string; // "YYYY-MM-DD"
  dueDate: string; // "YYYY-MM-DD"
  message: string | null;
  status: RequestStatus;
  createdAt: string; // ISO timestamp
}

// A request plus the item and owner details the dashboard displays.
export interface BorrowRequestWithItem extends BorrowRequest {
  itemTitle: string;
  ownerName: string;
}

// The small amount of item data the request form needs.
export interface ItemOption {
  id: string;
  title: string;
  ownerName: string;
}

// What the request form sends to POST /api/requests.
export interface NewBorrowRequest {
  itemId: string;
  startDate: string;
  dueDate: string;
  message?: string;
}

// Field-level validation errors, e.g. { dueDate: "Due date must be..." }.
export type FieldErrors = Partial<Record<keyof NewBorrowRequest, string>>;
