import "server-only";
import { auth } from "@/auth";

/**
 * The signed-in user's id (from the Auth.js session), or null when nobody is
 * signed in. Callers decide what "not signed in" means for them: the API
 * returns 401, and pages redirect to /login.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
