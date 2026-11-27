import "server-only";
import { connection } from "next/server";
import { auth } from "@/auth";

/**
 * The signed-in user's id (from the Auth.js session), or null when nobody is
 * signed in. Callers decide what "not signed in" means for them: the API
 * returns 401, and pages redirect to /login.
 */
export async function getCurrentUserId(): Promise<string | null> {
  // The session differs per visitor, so this must run at request time.
  // Without it, Cache Components tries to prerender auth(), which uses
  // crypto.getRandomValues() (same pattern as app/profile/page.tsx).
  await connection();
  const session = await auth();
  return session?.user?.id ?? null;
}
