
"use server";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileBio(formData: FormData) {
  // Verify that the resident is signed in.
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to update your profile.");
  }

  // Read and validate the bio.
  const bioValue = formData.get("bio");

  if (typeof bioValue !== "string") {
    throw new Error("Invalid profile bio.");
  }

  const bio = bioValue.trim();

  if (bio.length > 500) {
    throw new Error("Your bio must be 500 characters or fewer.");
  }

  // Update only the signed-in resident's profile.
  const updatedUsers = await sql`
    UPDATE users
    SET bio = ${bio},
        updated_at = NOW()
    WHERE id = ${session.user.id}
    RETURNING id
  `;

  if (updatedUsers.length === 0) {
    throw new Error("Profile not found.");
  }

  // Refresh the profile with the saved information.
  revalidatePath("/profile");
}
