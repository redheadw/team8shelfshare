
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { sql } from "@/lib/db";
import { updateProfileBio } from "./actions";

// Display the signed-in resident's profile.
async function ProfileContent() {
  await connection();

  const session = await auth();

  // Require authentication.
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load profile information from Neon PostgreSQL.
  const users = await sql`
    SELECT neighborhood, bio
    FROM users
    WHERE id = ${session.user.id}
    LIMIT 1
  `;

  if (users.length === 0) {
    redirect("/login");
  }

  const neighborhood = String(users[0].neighborhood ?? "");
  const bio = String(users[0].bio ?? "");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700">
        My ShelfShare Profile
      </h1>

      <p className="mt-3 text-gray-600">
        Manage your Lake Valley community profile.
      </p>

      <div className="mt-8 rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Resident Information
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Your name and email come from your signed-in account.
          You can update your About Me section below.
        </p>

        <form
          action={updateProfileBio}
          className="mt-6 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={session.user.name ?? ""}
              readOnly
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={session.user.email ?? ""}
              readOnly
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label
              htmlFor="neighborhood"
              className="block font-medium"
            >
              Neighborhood
            </label>

            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              value={neighborhood}
              readOnly
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          {/* Editable Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block font-medium"
            >
              About Me
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={bio}
              maxLength={500}
              placeholder="Tell your neighbors a little about yourself..."
              className="mt-2 w-full rounded-lg border p-3 focus:border-green-700 focus:outline-none"
            />

            <p className="mt-1 text-sm text-gray-500">
              Maximum 500 characters.
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800"
          >
            Save Profile
          </button>
        </form>
      </div>
    </main>
  );
}

// Suspense handles request-dependent authentication.
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-gray-600">
            Loading your ShelfShare profile...
          </p>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
