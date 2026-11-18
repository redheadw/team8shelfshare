// TEMPORARY: Auth.js sign-in (PR #10) is not merged into main yet, so every
// request is made as this seeded demo user (Ada Okafor in db/seed.sql).
// Once auth lands, replace uses of getCurrentUserId() with the signed-in
// user's id from `const session = await auth()`.
export const DEMO_BORROWER_ID = "11111111-1111-4111-8111-111111111111";

export async function getCurrentUserId(): Promise<string> {
  return DEMO_BORROWER_ID;
}
